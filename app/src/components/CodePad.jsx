import React from 'react';
import CodeMirror from 'react-codemirror';
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
      </div>
    );
  }
}

export default CodePad;
