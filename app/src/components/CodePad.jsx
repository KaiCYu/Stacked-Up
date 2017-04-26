import React from 'react';
import CodeMirror from 'react-codemirror';
import $ from 'jquery';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';

class CodePad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: props.updatedCode,
      output: '',
      logs: '',
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
    code.snippet = this.currentCode;
    console.log('>>>>>>>>>', this.currentCode);
    code.snippet = this.state.code;
    console.log('=============');
    console.log(code.snippet);
    console.log('=============');
    $.ajax({
      url: '/codeTest',
      type: 'POST',
      data: code,
      success: (result) => {
        console.log('codeTesting result', result);
        this.setState({
          output: result.result,
          logs: result.console,
        });
      },
      error: (error) => {
        console.log('codeTesting Failed', error);
      },
    });
  }

  updateCode(newCode) {
    this.currentCode = newCode;
    this.props.sendUpdatedCode(newCode);
  }

  render() {
    return (
      <div style={{ border: '1px solid black' }}>
        <CodeMirror value={this.props.updatedCode} onChange={this.updateCode} options={this.options} />
        <button onClick={this.codeTest}>Submit</button>
        <div>
          <span>Output</span>
          <span id="output">{this.state.output}</span><br />
          <span>Console Logs</span>
          <span id="logs">{this.state.logs}</span>
        </div>
      </div>
    );
  }
}

export default CodePad;
