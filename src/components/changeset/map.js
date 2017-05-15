import React from 'react';
import debounce from 'lodash.debounce';
import {render} from 'changeset-map';

let changesetId;
let adiffResult;
let width = 700;
let height = 500;

function loadMap() {
  var container = document.getElementById('container');
  try {
    render(container, changesetId, {
      width: width + 'px',
      height: Math.max(400, height) + 'px',
      data: adiffResult,
    });
  } catch (e) {
    console.log(e);
  }
}

var deb = debounce(loadMap, 700);

export class CMap extends React.PureComponent {
  props: {
    changesetId: number,
    adiffResult: Object,
  };
  state = {
    visible: false,
  };
  componentDidMount() {
    changesetId = this.props.changesetId;
    adiffResult = this.props.adiffResult;
    if (this.ref) {
      var rect = this.ref.parentNode.parentNode.getBoundingClientRect();
      height = parseInt(window.innerHeight * 0.5, 10);
      width = parseInt(rect.width, 10);
    }

    setTimeout(
      () => {
        this.setState({
          visible: true,
        });
      },
      700,
    );
    deb();
  }
  setRef = r => this.ref = r;
  render() {
    return (
      <div className="flex-parent justify--center">
        <div
          style={{
            height: parseInt(window.innerHeight * 0.5 - 55, 10),
            display: this.state.visible ? 'none' : 'block',
          }}
        />
        <div
          id="container"
          className="border border--2 border--gray-dark"
          style={{visibility: this.state.visible ? 'visible' : 'hidden'}}
          ref={this.setRef}
        />
      </div>
    );
  }
}
