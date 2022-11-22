import axios from 'axios';
import {getToken} from './token';

export default (id) => {
  const path = `/fileApi/file/${id}`;
  axios.post(path, '', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer '.concat(getToken()),
    },
    'responseType': 'blob'
  }).then((response) => {
    const blob = new Blob([response.data]);
    const linkNode = document.createElement('a');
    const filename = response.headers['content-disposition'].split('utf-8\' \'');
    linkNode.download = decodeURIComponent(filename[filename.length - 1], 'utf-8'); // a标签的download属性规定下载文件的名称
    linkNode.href = URL.createObjectURL(blob); // 生成一个Blob URL
    document.body.appendChild(linkNode);
    linkNode.click(); // 模拟在按钮上的一次鼠标单击
    URL.revokeObjectURL(linkNode.href); // 释放URL 对象
    document.body.removeChild(linkNode);
  }).catch((error) => {
    console.log(error);
  });
};
