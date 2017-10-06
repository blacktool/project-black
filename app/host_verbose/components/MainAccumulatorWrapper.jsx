import { connect } from 'react-redux';

import MainAccumulator from './MainAccumulator.jsx';


function mapStateToProps(state, ownProps){
    // Extract project
    let project_uuid = ownProps.match.params.project_uuid;
    let filtered_projects = _.filter(state.projects, (x) => {
        return x.project_uuid == project_uuid
    });

    let project = null;

    if (filtered_projects.length) {
        project = filtered_projects[0]
    } else {
        project = {
            "project_name": null,
            "project_uuid": null,
            "comment": ""
        }
    }

    // Extract hostname
    let hostname = ownProps.match.params.hostname;
    let filtered_hosts = _.filter(state.scopes['hosts'], (x) => {
        return ((x.hostname == hostname) && (x.project_uuid == project['project_uuid']));
    });

    let host = null;

    if (filtered_hosts.length) {
        host = filtered_hosts[0];
    } else {
        host = {
            "hostname": null,
            "_id": null,
            "comment": ""
        }
    }

    // Filter only related IPs
    let filtered_ips = _.filter(state.scopes.ips, (x) => {
        return x.hostnames.indexOf(host['hostname']) !== -1;
    });

    // TODO make proper ip choser
    let ip = null;

    if (filtered_ips.length) {
        ip = filtered_ips[0];
    }

    if (ip) {
        // Ports filter
        var ports_filtered = _.get(state.scans, ip.ip_address, []);

        var ports_sorted = ports_filtered.sort((a, b) => {
            if (a['port_number'] < b['port_number']) {
                return -1;
            }
            if (a['port_number'] > b['port_number']) {
                return 1;
            }
            if (a['port_number'] == b['port_number']) {
                return 0;
            }       
        });     
    }
    else {
        var ports_sorted = [];
    }



    return {
        project: project,
        host: host,
        ip: ip,
        ports: ports_sorted,
        tasks: _.filter(state.tasks.active, (x) => {
            return x.project_uuid == project['project_uuid']
        }),
        files: state.files[host.hostname]
    }
    // x['target'].split(':')[0] == host['hostname'])); is a shitty costil'
}


const MainAccumulatorWrapper = connect(
    mapStateToProps
)(MainAccumulator)

export default MainAccumulatorWrapper
