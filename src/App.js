import React, { Component } from 'react';
import CodeMirror from 'react-codemirror'
import jwt from 'jsonwebtoken'
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/markdown/markdown');
require('codemirror/lib/codemirror.css');

class App extends Component {
  state = {
    algorithm: 1,
    code: '{"firstname": "first"}',
    key: 'test-jwt',
    decodeKey: 'test-jwt',
    token: '',
    decodeToken: '',
    error: '',
    decodeError: '',
    decode: '',
  }
  setKey(e) {
    this.setState({
      key: e.target.value,
    })
  }
  setDecodeToken(e) {
    this.setState({
      decodeToken: e.target.value,
    })
  }
  setDecodeKey(e) {
    this.setState({
      decodeKey: e.target.value,
    })
  }
  setAlgorithm(e) {
    this.setState({
      algorithm: e.target.value,
    })
  }
  updateCode(code) {
    this.setState({
      code,
    })
  }
  async sign(e) {
    e.preventDefault()
    this.setState({
      error: '',
      token: ''
    })
    const {
      code, key, algorithm
    } = this.state
    console.log(code)
    try {
      const payload = JSON.parse(code)
      const al = algorithm === 1 ? 'HS256' : 'HS384'
      console.log(al, payload, key)
      const token = await jwt.sign(payload, key, { expiresIn: 60 * 60, algorithm: 'HS384' });
      console.log(token)
      this.setState({
        token,
      })
    } catch (error) {
      this.setState({
        error: 'Invalid json format'
      })
      console.log(error)
    }
  }
  async verify() {
    this.setState({
      decode: '',
      decodeError: '',
    })
    const {
      decodeToken, decodeKey,
    } = this.state
    try {
     const decode = await jwt.verify(decodeToken.trim(), decodeKey);
     this.setState({
        decode: JSON.stringify(decode),
     })
    } catch(error) {
      console.log(error)
      this.setState({
        decodeError: error.toString(),
      })
    }
  }
  render() {
    return (
      <div>
        <section className="header">
          <div className="title">
            <div>Tinker With <span className="red">JWT</span> Right Here in Your Browser.</div>
            <div>Don’t Worry, You Can’t Break It. We Promise. </div>
          </div>
        </section>
        <section className="algorithm">
          Choose algorithm
          <div className="select-algo">
            <select onChange={this.setAlgorithm.bind(this)} value={this.state.algorithm} className="form-control">
              <option value={1}>HS256</option>
              <option value={2}>HS384</option>
            </select>
          </div>
        </section>
        <section className="playground">
          <div className="container">
            <h2>Encode</h2>
            <div className="row">
              <div className="col-xs-12 col-sm-4">
                <div className="card">
                  <CodeMirror
                    options={{
                      mode: 'javascript',
                      lineNumbers: true,
                      theme: 'material',
                    }} value={this.state.code} onChange={this.updateCode.bind(this)} />
                    {
                      this.state.error !== '' && (
                        <div className="error">
                          {this.state.error}
                        </div>
                      )
                    }
                </div>
              </div>
              <div className="col-xs-12 col-sm-4">
                <div className="card">
                  <div className="form-group">
                    <label htmlFor="" style={{ color: 'white' }}>Key:</label>
                    <input type="text" onChange={this.setKey.bind(this)} value={this.state.key} className="form-control" />
                  </div>
                  <div className="button-group">
                    <button onClick={this.sign.bind(this)} type="button" className="btn-run">JWT.Sign</button>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-4">
                <div className="card" style={{ minHeight: 250 }}>
                  <div className="token">
                    {this.state.token}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <h2>Decode</h2>
              <div className="row">
                <div className="col-xs-12 col-sm-4">
                  <div className="card">
                    <textarea onChange={this.setDecodeToken.bind(this)} value={this.state.decodeToken} cols="10" rows="10" placeholder="JWT token here" className="form-control"></textarea>
                    {
                      this.state.decodeError !== '' && (
                        <div className="error">
                          {this.state.decodeError}
                        </div>
                      )
                    }
                  </div>
                </div>
                <div className="col-xs-12 col-sm-4">
                  <div className="card">
                    <div className="form-group">
                      <label htmlFor="" style={{ color: 'white' }}>Key:</label>
                      <input type="text" onChange={this.setDecodeKey.bind(this)} value={this.state.decodeKey} className="form-control" />
                    </div>
                    <div className="button-group">
                      <button onClick={this.verify.bind(this)} type="button" className="btn-run">JWT.Verify</button>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-4">
                  <div className="card" style={{ minHeight: 250 }}>
                    <div className="token">
                      {this.state.decode}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer>
          INT402 JSON WEB TOKEN
        </footer>
      </div>
    );
  }
}

export default App;
