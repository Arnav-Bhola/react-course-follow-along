import { Component } from "react";

import classes from "./User.module.scss";

class User extends Component {
  render() {
    return <li className={classes.user}>{this.props.name}</li>;
  }
}

export default User;

