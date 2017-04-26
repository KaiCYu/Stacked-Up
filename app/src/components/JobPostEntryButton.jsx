import React from 'react';
import RaisedButton from 'material-ui/FlatButton';

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
          <span> Applied </span>
        :
          <RaisedButton
            onClick={() => {
              this.props.handleApply(this.props.id);
              this.setState({ clicked: true });
            }}
          >
            apply
          </RaisedButton>
        }
      </div>
    );
  }
}

export default JobPostEntryButton;
