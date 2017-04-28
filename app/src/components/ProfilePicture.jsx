import React, { Component } from 'react';

export default class ProfilePicture extends Component {
  render() {
    const { mode, src, height, width, style, ...props } = this.props;
    const modes = {
      fill: 'cover',
      fit: 'contain',
    };
    const size = modes[mode] || 'contain';

    const defaults = {
      height: height || 200,
      width: width || 200,
      backgroundColor: 'gray',
    };

    const important = {
      backgroundImage: `url("${src}")`,
      backgroundSize: size,
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      float: 'left',
    };

    return <div {...props} style={{ ...defaults, ...style, ...important }} />;
  }
}
