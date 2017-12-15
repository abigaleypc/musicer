import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { currentPanelAction } from '../store/actions';

import { PANELS } from '../config/data'

import '../style/style.less';


function mapStateToProps(state) {
    const { currentPanel } = state.currentPanelReducer;
    return { currentPanel };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ currentPanelAction }, dispatch)
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panels: PANELS
        }
    }

    changePanel(panel) {
        this.props.currentPanelAction({ currentPanel: panel });
    }

    renderSidebar() {
        let renderPanel = [];
        this.state.panels.forEach((it, index) => {
            renderPanel.push(<a onClick={this.changePanel.bind(this, it)} className={this.props.currentPanel.str == it.str ? "musicer-list-group-item active" : "musicer-list-group-item"} key={index} >{it.title}</ a>)
        })
        return renderPanel;
    }

    render() {
        return (
            <div className="musicer-list-group">
                {this.renderSidebar()}
            </div>

        )
    }
}

const connectSidebar = connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar);

export default connectSidebar;
