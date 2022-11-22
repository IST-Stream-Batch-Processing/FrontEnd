import React from 'react';
import {Button, Card} from 'antd';

import LogicFlow from '@logicflow/core';
import {Control, DndPanel, SelectionSelect} from '@logicflow/extension';
import ServiceNode from '../../../../components/orchestration-services/nodes/ServiceNode';
import ParallelStartNode from '../../../../components/orchestration-services/nodes/ParallelStartNode';
import ParallelEndNode from '../../../../components/orchestration-services/nodes/ParallelEndNode';
import StartNode from '../../../../components/orchestration-services/nodes/StartNode';
import EndNode from '../../../../components/orchestration-services/nodes/EndNode';
import ConditionStartNode from '../../../../components/orchestration-services/nodes/ConditionStartNode';
import '@logicflow/core/dist/style/index.css';
import '@logicflow/extension/lib/style/index.css';
import '../../../../css/osService.css';

import NodeBinding from './NodeBinding';
import {getAllAS} from '../../../../api/developer';
import CompositeServiceNode from '../../../../components/orchestration-services/nodes/CompositeServiceNode';
import {getOSServices} from '../../../../api/osService';
import LoopStartNode from '../../../../components/orchestration-services/nodes/LoopStartNode';
import LoopEndNode from '../../../../components/orchestration-services/nodes/LoopEndNode';
import ConditionStartBinding from './ConditionStartBinding';
import ConditionEndBinding from './ConditionEndBinding';
import LoopStartBinding from './LoopStartBinding';
import ConditionEndNode from '../../../../components/orchestration-services/nodes/ConditionEndNode';
import LoopEndBinding from './LoopEndBinding';

export default class OrchestrationServiceGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lf: null,
      editable: props.editable,
      processTopology: this.initialProcessTopology(),
      showModal: false,
      showEndModal: false,
      showConditionModal: false,
      showConditionEndModal: false,
      showLoopModal: false,
      showLoopEndModal: false,
      asServices: [],
      osServices: [],
      currentNode: null, // 当前选中的节点
      nodeId2ParamBindingList: props.nodeId2ParamBindingList || {}, // {nodeId: [{fromNodeId, from: {fieldKey, fullFieldName}, target: {fieldKey, fullFieldName}]}}
      conditionNodeId2Qualified: props.conditionNodeId2Qualified || {},
      conditionNodeId2Unqualified: props.conditionNodeId2Unqualified || {},
      isEndBind: false,
      nextNodes: [],
      loopStartNodes: [],
      conditionStartNodes: []
    };
  }

  async componentDidMount() {
    await this.getASServices();
    await this.getOSServices();
    this.initialLogicFlow();
  }

  initialProcessTopology = () => {
    let processTopology = this.props.processTopology;
    if (processTopology === null || processTopology === undefined) {
      processTopology = {
        nodes: [{
          id: '0',
          serviceName: '组合服务',
          inType: this.props.outType || '',
          outType: this.props.inType || '',
          type: '组合服务输入输出信息'
        }], // [{id, serviceId, serviceName, inType, outType, type, x, y}]
        edges: [] // {sourceNodeId, targetNodeId}
      };
    } else {
      processTopology.nodes.push({
        id: '0',
        serviceName: '组合服务',
        inType: this.props.outType || '',
        outType: this.props.inType || '',
        type: '组合服务输入输出信息'
      });
    }
    return processTopology;
  }

  getASServices = async () => {
    getAllAS().then((r) => {
      this.setState({asServices: r});
    });
  }

  getOSServices = async () => {
    getOSServices().then((r) => {
      this.setState({osServices: r});
    });
  }

  initialLogicFlow = () => {
    const lf = new LogicFlow({
      container: document.querySelector('.graph'),
      grid: true,
      plugins: [DndPanel, SelectionSelect, Control],
      textEdit: false,
      keyboard: {
        enabled: true,
        shortcuts: [
          {
            keys: ['delete'],
            callback: () => {
              const elements = lf.getSelectElements(true);
              lf.clearSelectElements();
              elements.edges.forEach((edge) => lf.deleteEdge(edge.id));
              elements.nodes.forEach((node) => lf.deleteNode(node.id));
            }
          }
        ]
      }
    });
    this.registerItems(lf);
    if (this.state.editable) this.registerPanel(lf);
    this.bindEvent(lf);
    this.setState({lf}, this.initialRenderGraph);
  }

  registerPanel = (lf) => {
    lf.extension.dndPanel.setPatternItems([
      {
        type: 'SERVICE_NODE',
        label: '原子服务节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAc5SURBVGhD7ZlnaFRLFIBPjN3Ye++9K/aKBVFjV1QsIOIPURF/2LAXLKBiFAUFQbALoqIoNlAUBQWxV+y9917mzXecm+Stm92bzfrIk3ywZKfcnXvm1JnEGIv8BWRyf//3ZAiS3sgQJL2RIYgfPnz4IJMnT5ZJkybJ58+fXe+fIep55OHDh1KiRAn93qhRI8mSJYvExMTI69ev5eLFi9p/48YNqVixon6PFlHVyMyZM6VkyZKuJXLr1i2Ji4uTXLlyybNnz1yvSI8ePWTYsGGuFR2iIsjq1aulQoUKcvDgQalRo4buPrRu3VoePXokjx8/Vu14YGYIWbp0aZk9e7brTRtpMq1Dhw7J6NGjJU+ePPqBL1++6EsvXrxY29u2bVPT6t27t7Z3794t06dPl4IFC2r/+/fv5cmTJ7JgwQLp16+fzomEiDRy8uRJ3e1x48apKXlCfP/+XXf6xYsX2oY+ffokCgG3b99WM/v69au2MTu0OX/+fGnatKkcPXpU+1NLRIJs3LhR7t27J8WLF9dd/fnzp9y9e1cKFSok165dk7Vr17qZv4MGebZatWpy/fp1fRZ4Fs0cOHBA26kG04qEM2fOmMqVK5sGDRqYhg0bmrNnz7oR/1jhTZs2bUzdunVN1apVzYkTJ9xI6vEtyNixY41VvVm0aJHrMSY+Pt5s2LDBtSJn+/btpnPnzq5lzIABA0zevHlNhw4dXE94fDk7jrhlyxYpUKCAmtDSpUula9eubjRlLly4IK9evWKzpFy5clKmTBk3kjIrVqyQNWvWqKm9e/dOmjVrJkuWLHGjKePLR3iR7NmzS2xsrC7AC/ph3bp1MmLECM0ZhGY/EAiyZcuma7KeX3xp5MePH2L9QTJnzqxtHDoUW7dulYSEBM0XhFnAka0/yYwZM1Q7obD+on8/ffqka7GJ4UhVHrl69WriIoGQ1cnYY8aMkY8fP0r+/Pl1R9kE4Dshl/KEORMmTNBEWaxYMR0P5MqVKxrZ/BJWEDIvCSwU5Ia2bduqDyFApkyZ9KXv37+vIRpNMqds2bJqNvjNt2/fxDq0HDlyxP1KysydO1emTp3qWsEJ6yM4HC8zcuRImTJlimzatMmNJNGqVSs1PcwIId68eaPlB7t/7NgxOXz4sApSqlQpLV/y5csnhQsX1nnr1693v5IEpknVjOaKFi36rwSbEmEFwSR4yUuXLsnevXvV1gMh02MmgCaqVKkS9AVtqFbT9LI6to/WAqGC3rdvn5w7d07n+3F631Era9asurDn8MkhU6MJsjzh2ROCSIUPsPt79uzRPiIZ2mEuJsZZJRDWYC3W9OvCEZUogbBzOXLkUMfGfDwGDhwoderU0Wg1dOhQ1ytSqVIlnctO37lzx/WmjagIkjNnzsSaCc14sOt8IHm/B4K8ffvWtdJGVATp2bOnluO8GKblQfF4+vRpOXXqlKxatcr1/johYj4chWvXru1604YvQdhVHJSzBqV6IEQXQi/2TBkyaNAg7e/SpYtm6pcvX0qvXr20jyxPGEaDuXPn1r5AWIO1WNPTaDjCCoItU24Tudq3by9FihRxI0nglCzoBQXmDxkyxI0mgRDnz5/XOUDO6dSpk35PDmuwVvXq1TWze0k1FGET4qxZszR/BItWySHXEPPZZRyfHSU6eZcMN2/eVE0gBDtOfiJkBwu/gVC0BotuyfFdouADmzdv1p0mOweCb2BWffv2lcuXL6tQCJ+8RAESIomTFyNsDx48WPsD2b9/v9gyPmiQCAqChMM6p7GLG3sWN7b6NU+fPnUjwbHJTM8X9evXNx07dtRzhc3+xmrN2KLRzQqOzS0mLi5On7V+Z2xAcCOhibXF3kwnU4pQ59i5er6mvCC7t2vXzo3+DuaEw2NORCzMqF69elpXUZOFYuXKlRocqMNYi1uYcM+AL72VL19e6yIiDVGoZs2abiQ0CMNBafny5Vod+4HrJDYKP8IMOf/44pdiwmOLONO4cWOzcOFC12NM9+7dzY4dO1wrcubNm2cmTpzoWsYsW7bM2COBmTNnjusJj29BArFhVC8fuDiwqjcPHjxwI/45fvy4Xjo0adLEWK2H9b1QRJTZ7U5JfHy8nvQoCMkhzZs3l1GjRrkZoSECduvWTYYPH661GSGb+ouLPauNxHInNUQkSIsWLTRpPX/+XNuEVkp3kh0XdjhsSnCvhR8gDHO9RIrv8ZsUmL5DbjIiEoSIxRmEww91EzUTL0N+4SbeO6fDrl27ZOfOna71q8AkMXoJlohGPkHL/GbLli21P9WogaURcoNNhnrZZkOv6zWmf//+xu6+qVWrlrGmpH3kCVt6GPvC+kxCQoL2p5WoCAI2gxt75tAA4GH9RxMiH757sH/jx493reiQqlsUP1CeUOyBjWj6/xHgNMhxGTAlzvTRJOqCJIdrIW5gcOhp06Yl3tr/Cf6oIP8lEUWt9EiGIOmNDEHSG3+JICL/APvonjzb9n9gAAAAAElFTkSuQmCC'
      },
      {
        type: 'COMPOSITE_SERVICE_NODE',
        label: '组合服务节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAMLSURBVFhH1Zg9SytBFIbfxKBRMWpUxEAsDVrEzspWAmphk1oRuxjzAxREY2MQ/0HASvwq7P0NEhCUVAGxMYWmiB8YP+buO3d32Eiy14+9TnxgmOzs7Jx3zpzMnlmPMEAD4jXrhuOfHjs7O0M2m4XH44HX64WbDuaYr6+v8Pv92NzcNFv/4ihsb28Pc3Nz6O7uRqVSkQO5CU1zsk1NTSgWi1WTdhSWSCRwcHCASCSCkZERPDw8uCrOGuvi4gKXl5dYWVlBKpWSbVRZk7e3N7GwsCACgYAwBMq25+dnVwttlEolMTMzI7q6usTW1pa0QxyD34opYwB57fP5XC30GJeR49MO7Vk4CmPn/4016fchUlcYO7a1tf2IuFpUCbu5ucH29jY2NjaQyWRwfn6O1tZWLeKUsHK5jN7eXqytrck9JZ1Oo1AooKWlxezxsyhh6+vr6O/vx9DQECYmJhCLxRAMBvHy8mL2+FmUMO5RFDE6OorDw0Ps7+9jbGzM9b3royhh1tZg7C/yL8xCoQ0R/Ba6xNipKawRcBSmK/DJ7/SYThyFMYnTsVUQR2G6RJHfuZQ69zNHYVaupIO6wnTv/nWF6Qx88qEY0+E9x6VkjNFz7e3tZqv7dHZ2ymSU9uwO8Jl1FRRDUSzM+3O5nMxs7+/vzR5fg4btIWLZubq6kqcmO+rAm0wmsbu7i+npaezs7MiH4vE4Tk5OZN7P1Ns+6Gfgc/Q6c7zHx0d5qrdgHtjc3CwT0nw+j3A4LNtresya2fz8vKy/k/fzeXrj9PQUd3d3iEajGBgYUJ8c+NrjxKemppQoCT1GFhcXhZHji9nZWXlCtvP++rMYISDGx8eFERbi+PhYthkplTBEyboWKvi51pwBXcvfxj1VE9ZfKYQes66fnp5kG5eVtljXQsXY0tISjo6OMDg4iOHhYSnKLayl5McTw2OYnJw079RHCbu9vUVPTw9CoZCalVtwJQgD/Pr6Gh0dHfLaiarPUDyJr66uqpOS7da3oPf7+vqwvLwsA/0jOH4f04njK0kfwB/oJIBz8Pn+qAAAAABJRU5ErkJggg=='
      },
      {
        type: 'PARALLEL_START_NODE',
        label: '并行开始节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAATYSURBVFhHvVhHS15BFB0LKMaGDUnA3kE3/gBF0SyCFSyQIC7sDQX3ZiEuLRsXkoUg7ty5SKKgUewdgwb7QjRYwI4Ly82ccd5z3ufX/EJyYHy+uXPnHe/cNjL6C5yentKnT5+IMUYfPnygw8NDKXEMDpNZXFwkPz8/QUQb7u7uNDs7K1e8Hg6RAZGwsDADEW0EBQU5TOjVZBYWFiggIEB82MnJiTIzM6mpqYmSk5N1Qh4eHjQ1NSU17MeryKysrFBgYKD+0fLycjo/Pxey7e1tysjI0GWenp40Pz8vZPbCbjLT09OGo6msrKTLy0spfcLW1halpqbqa4KDg2lsbExKbcMuMtgwPDxc/0hVVRVdXV1JqRGbm5uUlpamr3379i0NDw9LqXXYJDMyMkLR0dH65nV1dXRzcyOl5oEQT0lJ0XVCQ0Pp27dvUmoZVsmASExMjL5pdXU1PTw8SKl1XFxcUFJSkq4Ly9oiZJEMjka1SEVFhVki6+vrVFRURF++fKHHx0c5+wQQUqMMFhoaGpLSlzBLZnJy0uCsiJq7uzspfQYiqaysTKxJSEignz9/SskzTAm9e/fOolO/IIOEBgVNGc56f38vpUacnJxQcXGxWBcVFUVLS0tSYgQIJSYm6nsiysyFvYHMzMwMeXt760oNDQ1WfQS16ePHj2ItjtQSGQBWVJ36zZs3Il2o0MmAqUoEFrEVNa8hAyDK0tPTDYTm5uakVJLBBEynErGUR1ScnZ1RSUmJ0ImNjaXV1VUpsQzTxKjWMvb792/BUBMiaswRgZnhI7AGBt739vb0FiIuLo4mJiaErrYGAzqm2NjYMJQOVHtYzSkrK4sGBwf5HGO5ubmst7eX+fj4iHcNa2trrLOzk11fXzMXFxcxhyf3J8b9jO3s7Agd7hOMtxWMR55YA3DnZ3l5eYyHv5x5AnT4ETNuFfHOeYinYOfl5UV9fX2SuxGFhYX6X+HI8PX1lTsZ0dzcbFjnDHYANy/78eOH+N0UvE1g8fHxLDIyknHfYDwrM34sYk6zoqurK+NZVsxDjnXcqYUOD3+xRgUvsoz7mHxjjDs2YzhTrWNzdnamz58/S97PQHgjoSEHoY3AwDuSY05OjtBFuh8YGKBfv37pa5aXl8Xz6OhI7vQEftwiSNAPQdfNzY329/efogkhqWbctrY2oWQLcNbS0lKhw60kiNgCiNTW1urfMkST+MkBQloHh9Ha2iolloFoUfMMLGENt7e3BiLoCNUW1ZCB0VKqnVxXV5eUmIcpGWtJD0W0sbHRQATHrMJABsAZq41Ud3e3lLwE/M0eMvC5+vp6fU+7apMG1IyIiAhduaOjQ0qMOD4+poKCArEG682RQbWvqanR93pV1dYwPj5uaKza29ulxIienh6RwbOzs2l3d1fOPgEWUX0kJCSEvn//LqUvYZEMwPOOqDnaZpaODP5g2ljhHVVf0/2rTk/D6OiogZAtpwYQNbhLaTro8L5+/SqllmGTDIAjU53aWtij7VCPBrcDa62mCrvIAKb3JnOJEQlNddZ/cm/SgLBX81BLS4uUkLjQ4fagyeDU/+xGqUFNjKhlaNb7+/spPz9fJ/Jf7toa1FqGYqe2q//1vxAaUMH9/f11Ehiovo4SARwmA6jl4P3793RwcCAljoDoD37r0w2IwCl5AAAAAElFTkSuQmCC'
      },
      {
        type: 'PARALLEL_END_NODE',
        label: '并行结束节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAALISURBVFhH7ZhJbupAEIYbyCKcBlB2nCAL5hkx5iIIEGLLFYAkSsQoxIYTsGPBaZgk/LpahWLjou22HSmL90mldDnV9k8P1WX7NA77g/jx75/DM2G9Xo91Oh30PACm0i2ZTAaWg7BUKoVX3eFamF6Ul+JcCWs2myZRN6vX6xjlDMfC8vk8KUhvuVwOo9VxJAweSAmhLJvNYi81lIXVajVSgMwqlQr2to+SsHK5TD4Y7OnpSRj1P7BSqYR3sYdtYbLpC4fD2vl81i6XixaJRMgYMJVptSVMNlJgg8EAIzXRpmJuZnfkLDM/3/bs6+sLPZrD4YAtY5vi+/ub8XWK3mOkwnhKYO/v7+h5x8fHB+PTih7NQ2HFYpHNZjP0vGexWLBCoYCeGVLY29sbm0wm6P0e0+mUNRoN9IyYhMEQD4dD9OxxPB6xZWzbYTweM37eoveDoVAEUTDEFKFQSPy6+8UNQl5fX1k0GhX+drtlm82GPT8/C/9GMBhko9GI7fd7vGIknU4bny32Jqfb7Zq29s0CgYB2Op0w0jnX61WahHk9h5G6dME7YcuMz+djfr90A9sC7iODJ2ls3U0lzPVyuUTPCM/oIv+4mcrPz0+22+3wipFYLMbW6zV6HDFuOvhcm4bYylqtFvbWRJuKkRkXhb1/MM0PLEDI9iroR+d+pKzglYdxpBBy4cDugaz/28BOhFOA4uGKhgRL5RevSCQSD1MTIN1q8/mcVatV9LyDVxhstVqhR2OZA+AQhxvJgB13Q9+m4HWdZbUiwE1gCRR5EE4ZFIqQPIGXlxcyBiyZTIoYO9gWBkCRRz0QzKq0hrcqFZSEAfBiQT1YZqr1PqAsDJBN673x3Ye91HAkDLDzbgmniFMcCwPgMwAlCMzJu6QeV8IA+IByL4o6+1RxLQzQi4vH43jVHZ596my326Ke6vf7eMUd/7/BqsHYPyIITITprNDcAAAAAElFTkSuQmCC'
      },
      {
        type: 'CONDITION_START_NODE',
        label: '条件判断节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAJ2SURBVFhH7Zhpq+owEIZ73Vdc/pQ/V3DfxQVFQVEUBRf0k/4KyfWNM7k9ejy2tgfz4T4QrJ2YvmaSmWn+iCuGhnjoUztcE5bL5YxqtUrfXACudEqtVsNykK3VatFdZzgWViqVRDweV8ISiYSoVCpkfR9HwmazmfB6vVJQOp0WyWRSXvt8PrFcLqnXe7wtrN1uC7/fL4UEAgFxOp1kgyi+1+l0qLd93hJWLBZFLBZTrjPPzmKxkPdgg4uvG4Is9rAtbDwei2AwKB+MdjgcyPIP3GN7KBQSk8mELNaxJazf70sX8UN3ux1ZHoGN++GPDIdDsljDsjDsvkgkIh+ERb5er8nynNVqpTZENBq1tVstCev1ekoU2mazIctr0Jd/B3FWZ+6lsNFoZNl9z7h363Q6JctzfhQG97GoVColttstWeyDmWO3YkO82q1PhSFOcUhAw3pxCsbg8RBKut0uWR75Vth8PlfBE22/35PFOWa3whvPMsSDMARPTjOY+uPxSBb3QJzjIIxM8Z1bvwhDlcAJGTPmNN/9BMbm9AWRzWaTLDeUsHw+LzuhYaGfz2ey/B7Irbwh0LDZGFUoXi4XurpxtdHVh7jpu1Eul9VO1MaVTKFQ0G/xM6gG+N+gaREumEajIXMbD6JFgGWwU80pyU7yvse1lMSgGjBnAS2SOIPaPRwOq8HtzBz68u9cLXsYuBUuwAPgEi0KRQYzZ7U2u3ffr5XWzGAw+CJOi5cRBm7lUIJAaY5FH3t9Y+r1ugrCmEEtXngZuMjj8Ugh2hwRMMit5hIcbvz4oQqDqoSFuXUM5dpRZzabNa7vnkYmk6E7zvh/BmsPw/gLYZ4vJ1albhAAAAAASUVORK5CYII='
      },
      {
        type: 'CONDITION_END_NODE',
        label: '条件结束节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAE/SURBVFhH7dhbCoJQFIVhayD6Ivrm/OfjIHyzWrV3Fzoe982jUD8sMin4CAPxdLlVHbgzvR623wL2fV/VdU3vgsI1GNEwDLiW7+u6js76CwG+46KRbmAKx4tAuoA5HM+LNAMlOJ4HaQJqcDwrUg204HgWpArowfG0SDEwAsfTIEXASBxPilwFboHjSZBZ4JY43hpyEVgCx8shk8CSON4S8gu4B46XQn4A8YHUF0vudj9JmkcfN6zTNNHRfs3zTEcUQZ/t+Su2bUuKV8k/yR7IFA4lgagkcgmHFoGoBDKHQ1kg2hK5hkOrQLQFUoJDIiCKREpxSAxEEUgNDqmAyIPU4pAaiCxICw6ZgEiDtOKQGYgkSA8OuYAoh/TikBuIUsgIHAoBondkFA6FPqNumuZ+PzeOI53x93+I7u3gwKq6AqyCz1JNioJPAAAAAElFTkSuQmCC'
      },
      {
        type: 'LOOP_START_NODE',
        label: '循环开始节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAOQSURBVFhHtZdLKD9RFMfP72chJUmKIkksPfPaKCklNhQrWVnII89kZSny2FJeCxsLEuWRR2wUUmTh/U6SZGFhh/O/9/zO3N/Mb0a/mZ/5f+r8ztzvuXPmzNx7584PMAReXl6wvLwcw8PDySoqKvD5+ZmjznBcwPb2NgKApW1ubnIv+zguQLtYQ0MDK4jNzc1Kd4qjM2ZnZ+kiOTk5rPjJzs6m2Pz8PCv28IqTbHN1dUW+srKSvJ6amhryjY2NsLu7S8e24EJsoT0BebeB5Ofnq2GQFhsbiw8PDxz9HVMBn5+feHR0hFNTU9jS0kKPOzExkaP+OdDW1sYKYkdHh9InJibQ6/Wq9vDwMPeyxlTA6+urOlmzkZERjiJubW2Z4pqtra1xL8Senh6li2Fh1YzlEDQ1NRkSB3J7e4sZGRkqnp6ejmJ+cNTPwcGB6jM4OMiqEVP2p6cndZK0kpISjoTG3t6eyvX4+MiqH1MBMTEx1Lm1tRWLiopwfX2dI6GjDUdUVBQrfgwF7OzsqGrdJjIykvIuLy/j+/s7vr29kW64Um5uLnUaGxtjxR0WFhYwKSlJ3Zy0r68vihkK0IJuU19fb7i4/j2irnZ4eEjBlJQUVtylqqpKFTA9Pc2qroDJyUkK1tXVseI+2tLVo/YC8QIin5CQQP5/cHJyAtXV1dzyoQoQxZAXHxjk/xdzc3N85EMVkJqaSn5mZgZGR0fh8vKS2m5wc3MDQ0NDZPLYgG8kkDYd2dRbVlYWR0MncJeUZloFhYWFKijfgO3t7aqdmZlJHUMhLy9P5ZG7p1VeuL+/V2Igmn5+fs6KfeTmFCyv3NS8q6ur4hhAVEhej9jnyS8uLpJ3wtLSEnmrvJ2dneRXVlZAfDv45qHm3eL7+5v8z88PeT0ej4d8WFgYgH77DUTTz87OWLHPxcVF0Lx3d3e+SVhQUKDE7u5u7OrqUu2/rIS0tDSVR+bU59W+rFV5+hmrmdR+4/r6GsVj5pYZMc6mfJpZbkYSmbS/vx8HBgZQvIhYRfz4+MDa2losLi5W+7o0K8bHxw0Xk59icrb39fVR7sDh9Mgf0TEopaWlID5IuQUQEREBvb29IL6iQfwvhP39fRDjzlGA6OhoOD4+huTkZFZ+gcqwSXx8vOHurEw+3o2NDT4jOLafgIZcQuJ/AohHC2LIaPnGxcWB2GpBTGbuZR/HBZyensqlC2VlZaz8BYB/lZ2cRkPW2vAAAAAASUVORK5CYII='
        },
      {
        type: 'LOOP_END_NODE',
        label: '循环结束节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAPPSURBVFhHtZdLKPxfFMDPjLyVR0gpQlYsyI6iZKM8y7NYWFBKKTuKBUtRFsqChYVsSMorkiILKXkmxJLyfiRv53fPceb7n+/Md8x8zfw/debee+695577+N57BvAP7O7uYl1dHQYFBWFwcDDnd3Z2pNYcph0YHR1FADCUkZERaeU5FvpRnT3GYrFIzhiT5sAqqUdMT09LzjUrKyuS8wxTDqytrUnONSUlJbCxsQGvr6+icQNtgTuurq44VSug2/PfJDs7GycnJ7nfbzg5cHFxwYepq6sLGxoasKioCNva2qSWN/hXmZiYwNTUVK3c3d0tPY1xcuD09FRnkKSpqUlqEefm5pzqbTIzM8Nt3t7esLm5WdP39PSw3gjDLRgYGNA6R0VF4fX1tdT8QE5mZmZibGwsxsTEcJ50jqyvr2t2Ojs7RavHyQH7TiQ5OTlS48z39zd+fHxIyZjx8XHNljrEov0PJwdoRtS4sbERCwoKcH5+Xmr+TktLC9sk247oHNjc3OSGGRkZeH9/z3vpC8hOXl4e215dXWUdHXZCdw8UFhZqaXh4OAQEBHDZWw4ODuD5+Znzubm5fJvu7+9zWVuBh4cHjIyMxIiICLy8vBSt97y8vGB1dTXP3iZlZWVSa7cCi4uLcHd3ByEhIaD2SrTeo15MGBsbAzWoaADUVyM5u6vYtiRpaWmc+hI/Pz+YmpoC9UnzttbX10uNnQNq2TlNT0/n9P/g5uYGEhMTISkpSTR2DtieWXfPrbccHx9L7gfNgYSEBE5pqdrb22F2dpbLvmBhYQFaW1tB3QewvLwsWkEOI6pnVHdS1V7xVest8fHxbMtmV50HrKmp4a+DYAdqa2t1g9uLN07Q4EY2SUpLS/kqh6OjI8MGNvH399deOTOoLdTN3EgODw/RSrfUb6jHhvfQLNTn/f1dSsbs7e2BlQZwhztDRqj7X3Ku4TYUbqm8S1GfJQchZllaWuL/DUY2bcJjf319YXl5uWEDEjqgf8U+NHMUOoSfn58/XwF5QgrHRhUVFYZP8u3tLR/Mp6cn0ehRW8axYGBgoJNNkuLiYi3Q1e4B6nR+fo59fX04NDSEW1tbSKtDbG9vY2VlJSYnJ6O6sFA91Rwp0Qwc6e3txbCwMG0wCu9OTk5wcHAQ+/v7eQz7SXn8z0hFSDA8PCwlgOjoaFDRMign4OzsDNSKgIodpRb44aEvLC4uTjQuYDc8JD8/X5uZkajBsKqqimfrKab+Gz4+PnKkRO95R0cHqLANrFYrP2ChoaGQkpICWVlZ0tpD2A0T0Hmgf8i+AfEfaku5veDaT8MAAAAASUVORK5CYII='
      },
      {
        type: 'START_NODE',
        label: '开始节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAOESURBVFhH7ZhLLyxBFMdrboLEhiAjSMQaEREZsUBsWSIh4v01hEisZQgJCZH5ChKZiaXXyg5jj2C8X7FC3f6fe6p0m56Znkc3i/tLKnVS3XXOv7vrcap90kD8Qv5w/evI6o29vLyIzc1NcXx8LGKxmICr8vJyUVdXJ7q6ukRRURHfmQEQlg6np6dyYGAAD+Oo9Pf3U5/Pz0/24AzHwnZ3d2VfX19c4LKyMtnQ0CDb29upwC4tLY27r6enR+7s7LC31DgSNjExIfPz8y2BJicnZTgcltFoVF5eXsqnpyf5/PxMtvFpZSQSkdPT05Y+eXl5cnx8nL0mJ6Wwjo4Oi/Pl5WW+4pyVlRWLD7zZVJ82qbDW1lbtbGhoiN5KpqDv6Oio9tfS0iI/Pj74ajwJhZnf1NzcHLdmz/z8vPbb1tbGrfHYCsOYckOUIhgMav8jIyPcaiVO2N7eniwoKKBOg4OD3Jp7hoeHKQYmld1stQjDgDQvCQ8PD3wl92DMqTi9vb3c+oVFGBZCdfPS0hK3usfa2pqOh9hmLMLw6dSNXqHiYYcwY1GgbpqamuIW95mZmdFxzejswli12RLCWL/Ycp9AIMCWEDc3N2yZ0h5jC6Ha2OdEdXU12V5QU1NDGQnY2tqiGmhhh4eHVFdVVZE4rygpKRGVlZVkHx0dUQ20sOvra6qLi4tFYWEh2V6AWCpvUxqAFmasYWx5i8/nowLMGrSwiooKqo2FT7y9vZHtBa+vr+Lx8ZFsNdaAFlZbW0v1+fm5uL+/J9sLjN1FXFxckF1fX081wcuGvLu70+sJEkCvQEKp4t7e3nKraR3D7FDs7++z5T4HBwds/VuqNCyQ+MktCWcCMxYF5k18dXWVW91jfX1dx0u6iQOkIOpm49zIrbkHBxcVJ2XaA5C04TSDDsjR3QKnJcRArO3tbW79wnYwjY2N6adBGpxrFhYWtH/EsiPhKMcRyw1xi4uL2m/ahxGANLu5uVk7waEhm+Mbxqv6fCjwndHxDUDc9wNvJrM1FApZfOBNvb+/81V7kgpTYBx8/0WAzBOr9snJiby6upLGnkdvJRaLURuuzc7OWvpgoDudUI6EAcxW81Kiit/vl42NjbKzs5NKU1MTtX2/Dwuo3exLhGNhirOzM9u/PokKHgZ9MCzSIasfd0hXNjY2RDQapR93AKkLMpXu7u6sMuH//2DTQ4i/tsF0760CthoAAAAASUVORK5CYII='
      },
      {
        type: 'END_NODE',
        label: '结束节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAASaSURBVFhH7ZhHSzRNEMfHR4yYXRTBT6CCKIqICa/ixSxiwIBe/AoKIgZQREyY0IvgWVD0agIPHo1XFVxzFnO/8++t7p1xdtZZ9z08h+cHxdZ0V1fX9Ex116wPU1H+Qv7Q71+HVyv28PCgLC0tKTs7O8r5+bkCV7GxsUpiYqJSUFCghIeHk+UvQGBW+fr6YkdHR6yyshI3Y0nKy8v5GIz1BMuBbWxssNLSUsPENpuNJScns9zcXJaXl8f16Ohogx3Grq+vk7efsRRYfX098/f3103U1tbGVlZW2N7eHrPb7ez+/p4L9N3dXd7X3t6uGwMf8GUFt4Fh+bESWudjY2PUa52pqSmdj+zsbPb+/k69rjEN7OPjg2VkZEhnNTU1fEV+C8ZitYS/9PR0t8GZBoa7Ek4GBgao1XuGhoakX8xhhsvAGhsbLQeFu355eWG3t7dcoP/0mAYHB6X/uro6atVjCGxzc5MFBATwQbW1tdRqZH9/n/X397PQ0FA5iZCQkBDW09PDk8CMpqYmbuvn58fW1tao1YkhsLKyMjnB3d0dteqZnJxkkZGR0s5M1A2WjY+P0yg9j4+P0q6oqMiwz+kCw0YojM2yr7W1VdpYlZaWFhqtZ2ZmRtpgbi26wKqqqqShK76nvScyMTFBXvSIfmzAWnQRCCNsjN/BOxUVFSVtPJWIiAiX71xnZ6e00SKrC3WfIU1RMjMzSXOyuLioXF9f05XnqBmrLCws0JUTdT8jTVEuLi5IU6EA2fz8PI8a5xyOGS1If1fZ56kEBwcbthI8iZiYGN4/NzdHrZoVU5eZ/8bHxyvqI+O6QD0FeInjLc/Pz8rn5yddOVAXgs8JUD4JZGCopwBqKPXOuC54fX0lzXu0rwwICgpSwsLCuC5iADIwdR8hzYi6sqR5j4+PD2kOcC3atDHIwOLi4vivuqnyJdeCu/q/UN9V0hw8PT3xxACofgUysISEBP57cnJiyD5fX1+Dw98QGBjIfWm5ublRTk9PuZ6UlMR/OY4cYOzq6kpmz/LyMrU66evrk/2/ld7eXvLmBAWl6L+8vKRWTVZqM3Fra4s0J/i4UM9HuvIcJFVhYSFdOdne3ibNkaESCpBTUVEho3cFjhXR76mMjo6SFz2iv7i4mFoc6CLQHuLT09PUqgcHsrCxKg0NDTRaDzZUYeP2EEfpgciFsVkpjVJG3XuknZnAxqxK0ZY9mNNt2QPwiYXiDQPM7hSouzTr7u7mx4yYQAgKza6uLm5jRnNzM7e1XCgClLtikuHhYWp1jSitkVEQK6X1yMiI9G+5tBbk5ORYDs4TtEFlZWVRqxHTwNTDln9iCSf4QFEPcur1HHWHl48PkpaWxtQzmHqNmAYG8Ei0n3GQ2dlZ6rWONvsg8Pn29ka9rnEbmADvgUgIIR0dHXzXPjg4YGdnZzzLsKLQ0YY+JIB2DHxUV1eTV/dYCgwgc0pKSnQTQdSDl6WkpLD8/HwuqampvO27HbaE1dVV8vYzlgMD2GuOj49d/utjJrDFmO/71E949ccdKgPU8YeHh4rdbudtKF1QqeBstdlsvO03/PsP1jMU5T8oyG0REdwLFAAAAABJRU5ErkJggg=='
      }
    ]);
  }

  registerItems = (lf) => {
    lf.register(ServiceNode);
    lf.register(CompositeServiceNode);
    lf.register(ParallelStartNode);
    lf.register(ParallelEndNode);
    lf.register(StartNode);
    lf.register(EndNode);
    lf.register(ConditionStartNode);
    lf.register(ConditionEndNode);
    lf.register(LoopStartNode);
    lf.register(LoopEndNode);
  }

  bindEvent = (lf) => {
    lf.on('node:contextmenu', (data) => {
      if (data.data.type === 'SERVICE_NODE' || data.data.type === 'COMPOSITE_SERVICE_NODE') {
        this.setState(prev => ({
          showModal: true,
          currentNode: prev.processTopology.nodes.find((item) => item.id === data.data.id),
        }));
      }
      if (data.data.type === 'CONDITION_START_NODE') {
        const { processTopology } = this.state;
        const currentNode = processTopology.nodes.find((item) => item.id === data.data.id);
        const nextNodes = [];
        processTopology.edges.forEach((item) => {
          if (item.sourceNodeId === currentNode.id) {
            nextNodes.push(processTopology.nodes.find(node => node.id === item.targetNodeId));
          }
        });
        this.setState(prev => ({
          showConditionModal: true,
          currentNode,
          nextNodes
        }));
      }
      if (data.data.type === 'CONDITION_END_NODE') {
       this.setState(prev => ({
          showConditionEndModal: true,
          currentNode: prev.processTopology.nodes.find((item) => item.id === data.data.id),
          conditionStartNodes: prev.processTopology.nodes.filter((item) => item.type === 'CONDITION_START_NODE')
      }));
      }
      if (data.data.type === 'LOOP_START_NODE') {
        this.setState(prev => ({
          showLoopModal: true,
          currentNode: prev.processTopology.nodes.find((item) => item.id === data.data.id),
        }));
      }
      if (data.data.type === 'LOOP_END_NODE') {
        const { processTopology } = this.state;
        const currentNode = processTopology.nodes.find((item) => item.id === data.data.id);
        const nextNodes = [];
        processTopology.edges.forEach((item) => {
          if (item.sourceNodeId === currentNode.id) {
            nextNodes.push(processTopology.nodes.find(node => node.id === item.targetNodeId));
          }
        });
        this.setState(prev => ({
          showLoopEndModal: true,
          currentNode,
          nextNodes,
          loopStartNodes: processTopology.nodes.filter((item) => item.type === 'LOOP_START_NODE')
        }));
      }
    });
    lf.on('node:dnd-add', (data) => {
      const { processTopology } = this.state;
      processTopology.nodes = processTopology.nodes.concat(data.data);
      this.setState({processTopology});
    });
    lf.on('node:delete', (data) => {
      const { processTopology } = this.state;
      processTopology.nodes = processTopology.nodes.filter(node => node.id !== data.data.id);
      this.setState({processTopology});
    });
    lf.on('edge:add', (data) => {
      const { processTopology } = this.state;
      processTopology.edges = processTopology.edges.concat(data.data);
      this.setState({processTopology});
    });
    lf.on('edge:delete', (data) => {
      const { processTopology } = this.state;
      processTopology.edges = processTopology.edges.filter(edge => edge.id !== data.data.id);
      this.setState({processTopology});
    });
  }

  onCancel = () => {
    this.setState({
      currentNode: null,
      showModal: false,
      showEndModal: false,
      isEndBind: false,
    });
  }

  onOk = (service, paramBinding) => {
    const { nodeId2ParamBindingList, processTopology } = this.state;
    const { currentNode, showEndModal } = this.state;
    nodeId2ParamBindingList[currentNode.id] = paramBinding; // 更改绑定的信息
    if (currentNode.serviceId !== undefined && service.id !== currentNode.serviceId) {
      Object.keys(nodeId2ParamBindingList).forEach((key) => { // 如果绑定的服务有更改，消去对别人的影响
        let paramBindingList = nodeId2ParamBindingList[key];
        paramBindingList = paramBindingList.filter((item) => item.fromNodeId !== currentNode.id);
        nodeId2ParamBindingList[key] = paramBindingList;
      });
    }
    if (!showEndModal) {
      processTopology.nodes = processTopology.nodes.map((item) => { // nodes中信息更改
        if (item.id === currentNode.id) {
          return {
            ...item,
            serviceId: service.id,
            serviceName: service.name,
            inType: service.inType,
            outType: service.outType,
          };
        }
      return item;
      });
    }
    this.setState({
      nodeId2ParamBindingList,
      processTopology,
      showModal: false,
      currentNode: null,
      isEndBind: false
    }, this.state.showEndModal ? this.submit : this.addText(currentNode.id, service.name));
  }

  addText = (id, text) => {
    const {lf} = this.state;
    lf.updateText(id, text);
  }

  conditionOnCancel = () => {
    this.setState({
      currentNode: null,
      showConditionModal: false,
    });
  }

  conditionOnOk = (condition, qualifiedNodeId, unqualifiedNodeId) => {
    const { processTopology, currentNode } = this.state;
    processTopology.nodes.forEach((item, index, arr) => {
      if (currentNode.id === item.id) {
        arr[index] = {
          ...item,
          qualifiedNodeId,
          unqualifiedNodeId,
          condition,
        };
      }
    });
    this.setState({
      processTopology,
      showConditionModal: false,
      currentNode: null,
    });
  }

  conditionEndOnCancel = () => {
    this.setState({
      currentNode: null,
      showConditionEndModal: false,
    });
  }

  conditionEndOnOk = (inType, paramBindingQualified, paramBindingUnqualified, conditionStartNodeId) => {
    const {
        conditionNodeId2Qualified, conditionNodeId2Unqualified, processTopology, currentNode
    } = this.state;
    conditionNodeId2Qualified[currentNode.id] = paramBindingQualified; // 更改绑定的信息
    conditionNodeId2Unqualified[currentNode.id] = paramBindingUnqualified;
    processTopology.nodes = processTopology.nodes.map((item) => { // nodes中信息更改
      if (item.id === currentNode.id) {
        return {
          ...item,
          inType,
          outType: inType,
          conditionStartNodeId
        };
      }
      return item;
    });
    this.setState({
      conditionNodeId2Qualified,
      conditionNodeId2Unqualified,
      processTopology,
      showConditionEndModal: false,
      currentNode: null,
    });
  }

  loopOnCancel = () => {
    this.setState({
      currentNode: null,
      showLoopModal: false,
    });
  }

  loopOnOk = (loopCount) => {
    const { processTopology, currentNode } = this.state;
    processTopology.nodes.forEach((item, index, arr) => {
      if (currentNode.id === item.id) {
        arr[index] = {
          ...item,
          loopCount
        };
      }
    });
    this.setState({
      processTopology,
      showLoopModal: false,
      currentNode: null,
    });
  }

  loopEndOnOk = (condition, qualifiedNodeId, unqualifiedNodeId, loopStartNodeId) => {
    const { processTopology, currentNode } = this.state;
    processTopology.nodes.forEach((item, index, arr) => {
      if (currentNode.id === item.id) {
        arr[index] = {
          ...item,
          qualifiedNodeId,
          unqualifiedNodeId,
          condition,
          loopStartNodeId,
        };
      }
    });
    this.setState({
      processTopology,
      showLoopEndModal: false,
      currentNode: null,
    });
  }

  loopEndOnCancel = () => {
    this.setState({
      currentNode: null,
      showLoopEndModal: false,
    });
  }

  initialRenderGraph = () => {
    const { lf, processTopology } = this.state;
    const nodes = processTopology.nodes.filter(item => item.id !== '0');
    lf.render({
      nodes,
      edges: processTopology.edges
    });
    nodes.forEach((item) => {
      lf.updateText(item.id, item.serviceName || '');
    });
  }

  submit = () => {
    const {processTopology, lf} = this.state;
    processTopology.nodes.forEach((item, index, arr) => {
      if (item.id !== '0') {
        arr[index] = {
          ...item,
          x: lf.getNodeDataById(item.id).x,
          y: lf.getNodeDataById(item.id).y
        };
      }
    });
    this.props.submit(processTopology, this.state.nodeId2ParamBindingList, this.state.conditionNodeId2Qualified, this.state.conditionNodeId2UnQualified);
    this.setState({
      showEndModal: false
    });
  }

  bindEndNode = () => {
    this.setState(prev => ({
      showEndModal: true,
      currentNode: prev.processTopology.nodes.find((item) => item.id === '0'),
      isEndBind: true
    }));
  }

  render() {
    return (
      <>
      <Card className="card" bodyStyle={{height: '100%'}}>
        <div className="graph" />
        <NodeBinding
          key={`${this.state.currentNode + this.state.showEndModal}nodeBinding`}
          showModal={this.state.showModal || this.state.showEndModal}
          currentNode={this.state.currentNode}
          services={this.state.currentNode !== null && this.state.currentNode.type === 'SERVICE_NODE' ? this.state.asServices : this.state.osServices}
          bindServices={this.state.processTopology.nodes}
          nodeId2ParamBindingList={this.state.nodeId2ParamBindingList}
          onCancel={this.onCancel}
          onOk={(service, paramBinding) => this.onOk(service, paramBinding)}
          isEndBind={this.state.isEndBind}
          editable={this.state.editable}
        />
         <ConditionStartBinding
          key={`${this.state.currentNode + this.state.showConditionModal}conditionStartBinding`}
          showConditionModal={this.state.showConditionModal}
          currentNode={this.state.currentNode}
          nextNodes={this.state.nextNodes}
          bindServices={this.state.processTopology.nodes}
          editable={this.state.editable}
          onCancel={this.conditionOnCancel}
          onOk={(condition, qualifiedNodeId, unqualifiedNodeId) => this.conditionOnOk(condition, qualifiedNodeId, unqualifiedNodeId)}
         />
        <ConditionEndBinding
          key={`${this.state.currentNode + this.state.showConditionEndModal}conditionEndBinding`}
          showConditionEndModal={this.state.showConditionEndModal}
          currentNode={this.state.currentNode}
          bindServices={this.state.processTopology.nodes}
          conditionStartNodes={this.state.conditionStartNodes}
          conditionNodeId2Qualified={this.state.conditionNodeId2Qualified}
          conditionNodeId2Unqualified={this.state.conditionNodeId2Unqualified}
          editable={this.state.editable}
          onCancel={this.conditionEndOnCancel}
          onOk={(inType, conditionNodeId2Qualified, conditionNodeId2Unqualified, conditionStartNodeId) => this.conditionEndOnOk(inType, conditionNodeId2Qualified, conditionNodeId2Unqualified, conditionStartNodeId)}
        />
        <LoopStartBinding
          key={`${this.state.currentNode + this.state.showLoopModal}loopStartBinding`}
          showLoopModal={this.state.showLoopModal}
          currentNode={this.state.currentNode}
          editable={this.state.editable}
          onCancel={this.loopOnCancel}
          onOk={(loopCount) => this.loopOnOk(loopCount)}
        />
        <LoopEndBinding
          key={`${this.state.currentNode + this.state.showLoopEndModal}loopEndBinding`}
          showModal={this.state.showLoopEndModal}
          currentNode={this.state.currentNode}
          nextNodes={this.state.nextNodes}
          loopStartNodes={this.state.loopStartNodes}
          bindServices={this.state.processTopology.nodes}
          editable={this.state.editable}
          onCancel={this.loopEndOnCancel}
          onOk={(condition, qualifiedNodeId, unqualifiedNodeId, loopStartNodeId) => this.loopEndOnOk(condition, qualifiedNodeId, unqualifiedNodeId, loopStartNodeId)}
        />
      </Card>
        {this.state.editable ? (
          <div className="steps-action" style={{textAlign: 'center'}}>
                    <Button
                      type="primary"
                      onClick={this.bindEndNode}
                    >
                      完成
                    </Button>
          </div>
          ) : (
            <div className="steps-action" style={{textAlign: 'right'}}>
                <Button
                  type="ghost"
                  onClick={this.bindEndNode}
                >
                  查看组合服务输出绑定信息
                </Button>
            </div>
        )}
      </>
    );
  }
}
