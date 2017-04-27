import React from 'react';
import FlatButton from 'material-ui/FlatButton';

class JobPostEntryButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    };
  }

  componentWillMount() {
    if (this.props.apply === true) {
      this.setState({ clicked: true });
    }
  }

  render() {
    return (
      <div>
        {this.state.clicked ?
          <FlatButton
            label="Applied"
            primary
          />
        :
          <FlatButton
            label="Apply"
            primary
            onClick={() => {
              this.props.handleApply(this.props.id);
              this.setState({ clicked: true });
            }}
          />
        }
      </div>
    );
  }
}

export default JobPostEntryButton;
