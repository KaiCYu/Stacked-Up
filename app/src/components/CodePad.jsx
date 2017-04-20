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
      code: '// code',
    };
    this.updateCode = this.updateCode.bind(this);
    this.codeTest = this.codeTest.bind(this);
  }

  codeTest() {
    const code = {};
    code.snippet = this.state.code;
    $.ajax({
      url: '/codeTest',
      type: 'POST',
      data: code,
      success: (result) => {
        console.log('codeTesting result', result);
        this.setState({
          code: result.snippet,
        });
      },
      error: (error) => {
        console.log('codeTesting Failed', error);
      },
    });
  }

  updateCode(newCode) {
    this.setState({
      code: newCode,
    });
  }

  render() {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
    };
    console.log(CodeMirror);
    return (
      <div style={{ border: '1px solid black' }}>
        <CodeMirror value={this.state.code} onChange={this.updateCode} options={options} />
        <button onClick={this.codeTest}>Submit</button>
      </div>
    );
  }
}

export default CodePad;
