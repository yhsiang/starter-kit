import React, {Component} from 'react';

import styles from './Base.css';

export default class Base extends Component {
  render () {
    return (
      <div className={styles.root}>
        I am Base Component
      </div>
    );
  }
}
