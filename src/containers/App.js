import React, {Component} from 'react';
import { connect } from 'react-redux';
import Base from '../components/Base';
import * as AppAction from '../actions';

class App extends Component {
  render () {

    return (
      <div>
        <Base />
        <a onClick={()=>{ this.props.echoWorld()}}> Click me</a>
        <div>
          {this.props.app.get('message')}
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    app: state.app
  }
}

export default connect(
  mapStateToProps,
  AppAction
)(App)
