import React from 'react';
import { Button } from 'antd';
import { observable, action, configure } from 'mobx';
import { observer } from 'mobx-react';
import config from './../settings/config.json';

configure({ isolateGlobalState: true }, { enforceActions: true });
// 必须使用孤立全局状态参数，否则会报错，因为在4.2版本之后不允许多个mobx同时存在

class MyState {
  @observable num = 0;

  @action addNum = () => {
    if (this.num < 10) {
      this.num += 1;
    }
  };
}

const newState = new MyState();

const Main = observer(props => (
  <div>
    <div>
      <Button onClick={props.store.addNum}>{config.actionName}</Button>
    </div>
  </div>
));

function getImgs(num) {
  const doms = [];
  const limit = (num > 10) ? 10 : num;
  for (let i = limit - 1; i >= 0; i -= 1) {
    doms.push(<p>假装这里有张图</p>);
  }
  return doms;
}

const Imgs = observer(props => (
  <div className="img-wraper">
    {getImgs(props.store.num)}
  </div>
));

const Result = observer(props => (
  <div>
    <p style={(props.store.num === 10) ? { display: 'block' } : { display: 'none' }}>{config.resultName}</p>
  </div>
));

@observer
class Demo extends React.Component {
  render() {
    return (
      <div>
        <Main store={newState} />
        <Imgs store={newState} />
        <Result store={newState} />
      </div>
    );
  }
}

export default Demo;
