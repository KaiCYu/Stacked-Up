import React from 'react';
import CodeMirror from 'react-codemirror';
import $ from 'jquery';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';

class CodePad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output: '',
    };
    this.options = {
      lineNumbers: true,
      mode: 'javascript',
    };
    this.updateCode = this.updateCode.bind(this);
    this.codeTest = this.codeTest.bind(this);
  }

  codeTest() {
    const code = {};
    code.snippet = this.props.updatedCode;
    $.ajax({
      url: '/codeTest',
      type: 'POST',
      data: code,
      success: (result) => {
        console.log('codeTesting result', result);
        this.setState({
          output: result.result,
        });
      },
      error: (error) => {
        console.log('codeTesting Failed', error);
      },
    });
  }

  updateCode(newCode) {
    this.props.sendUpdatedCode(newCode);
  }

  render() {
    return (
      <div>
        <div style={{ border: '1px solid black' }}>
          <CodeMirror value={this.props.updatedCode} onChange={this.updateCode} options={this.options} />
        </div>
        <FlatButton label="Run" onClick={this.codeTest} primary fullWidth />
        {this.state.output ?
          <div>
            <div>
              <div>Output</div>
              <Divider />
              <div id="output">{this.state.output}</div>
            </div>
          </div>
        :
        null
        }
      </div>
    );
  }
}

export default CodePad;
