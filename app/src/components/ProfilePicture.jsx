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
      height: height || 100,
      width: width || 100,
      backgroundColor: 'gray',
    };

    const important = {
      backgroundImage: `url("${src}")`,
      backgroundSize: size,
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    };

    return <div {...props} style={{ ...defaults, ...style, ...important }} />;
  }
}
