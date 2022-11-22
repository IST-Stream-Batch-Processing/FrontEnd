## 相关文件说明

GUI服务相关的文件保存在此目录下，下面也将其默认为根目录来进行说明。

### 管理界面

管理所有界面的相关文件保存在layouts文件夹下，下面来说明其中的各个文件。

#### CreateLayoutPopup

在页面内点击新增界面后弹出的窗口组件。在点击确认后会发送创建新界面的请求。

#### LayoutCard

表示单个界面的卡片组件。在点击修改按钮后会跳转到编辑界面。

#### LayoutPage

表示整个管理界面的页面组件。

### 编辑器界面

编辑器界面的相关文件保存在customizer文件夹下，下面来说明其中的各个文件。

#### Editor

表示整个编辑器界面的页面组件。

##### componentDidMount()

在componentDidMount（）函数中，Editor会获取其他服务的数据。

```
componentDidMount() {  
    this.getTableData();  
    this.getLayouts();  
    this.getData();  
    this.getASServiceData();  
    this.getOSServiceData();  
}
```

##### reloadEditor()

reloadEditor()函数的主要用途便是重置Editor的reload state，这样做的用处主要是能够将该函数作为props传给Editor的子组件，而子组件可以通过调用该函数来触发Editor进行更新。

```
reloadEditor() {  
    this.setState((state) => ({reload: {}}));  
}
```

#### api-util

api-util文件夹内的内容为编辑器界面内使用到的工具型组件。

##### DataCard

DataCard是修改数据服务类型的Api所使用到的组件。

##### TypeTree

TypeTree是修改原子服务或组合服务类型的Api所使用到的组件。其主要是用来修改api的bindingMap数据。Typetree会展示选定的Api所需要绑定的所有属性，且为这些属性生成cascader，cascader的options为界面目前的context。

##### VariableInput

#### canvas

canvas文件夹中的内容为编辑器中画布内所使用到的所有组件。

##### components

components中为所有提供给用户编排的基础组件。

##### containers

containers中的文件目前只有CustomDiv一个组件，CustomDiv对应了Container类。用户可以通过拖拽生成CustomDiv，且components内的所有组件必须被保存、渲染在CustomDiv内。通过拖拽生成的components数据将会被保存在CustomDiv所对应的Container类，且被渲染在CustomDiv内。

##### CustomizerCanvas

CustomizerCanvas渲染了编辑器内的画布，通过解析Layout模型的数据生成components与containers文件夹中的内容。

#### client-view

client-view文件夹中的内容为已发布界面在被正式访问时渲染所使用的各个组件。

#### page-header

page-header文件夹中的内容为编辑器的header区域所使用到的所有组件。

##### CustomizerPageHeader

该文件夹中目前仅有CustomizerPageHeader一个组件。该组件负责界面名称、发布状态的修改，保存（上传）当前编辑状态，以及查看当前已发布界面的预览界面。

#### properties-panel

properties-panel中的内容为编辑器右侧侧边栏使用到的所有组件。

##### api-properties

api-properties中的内容为API栏使用到的所有组件。
API栏的用途是修改Layout的apis属性。

##### component-properties

component-properties中的内容为属性栏所使用到的所有组件。
属性栏的用途是修改画布中选定的Container或Component的属性。

##### constant-properties

constant-properties中的内容为常量栏所使用到的所有组件。
常量栏的用途是修改Layout的constant属性。

##### generate-components

generate-components中的内容为组件栏所使用到的所有组件。
组件栏的用途是展示所有当前允许拖拽的组件，且允许用户通过拖拽到画布的方式来生成Component和Container。

##### hierarchy

hierarchy中的内容为结构栏所使用到的所有组件。
结构栏的用途是展示目前canvas内的组件的组织结构，具体为Layout类containers属性的树状结构（衍生到每个container的components属性）。

##### input-properties

input-properties中的内容为输入栏所使用到的所有组件。
输入栏的用途是对Layout类的input属性进行编辑。

##### layout-properties

layout-properties中的内容为样式栏所使用到的所有组件。
样式栏的用途是对Layout的styleproperties进行编辑。
