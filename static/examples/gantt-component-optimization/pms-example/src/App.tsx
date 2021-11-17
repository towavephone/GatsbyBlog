import React, { ReactNode } from 'react';
import { Gantt, Task, ListColumn } from '@towavephone/gantt-task-react';
import moment from 'moment';

import '@towavephone/gantt-task-react/dist/index.css';

import styles from './styles.module.css';
import { TASKS } from './const';

// 数据
interface TaskDataItem {
  taskStartDate?: string;
  taskEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  workTask: string;
}

type TaskRenderItem = TaskDataItem & Task;

interface RenderItem {
  children: ReactNode;
  props: {
    [key: string]: any;
  };
}

const getTasks = (tasks: TaskDataItem[]) => {
  const generateTasks: TaskRenderItem[] = [];
  tasks.forEach(({ taskStartDate, taskEndDate, actualStartDate, actualEndDate, ...rest }, index) => {
    if (taskStartDate && taskEndDate) {
      generateTasks.push({
        ...rest,
        start: moment(taskStartDate).toDate(),
        end: moment(taskEndDate).toDate(),
        name: '计划周期',
        id: 'Task' + index,
        styles: {
          backgroundColor: '#ffde82'
        }
      });
    }
    if (actualStartDate && actualEndDate) {
      generateTasks.push({
        ...rest,
        start: moment(actualStartDate).toDate(),
        end: moment(actualEndDate).toDate(),
        name: '实际周期',
        id: 'Actual ' + index,
        styles: {
          backgroundColor: '#8cc5ff'
        }
      });
    }
  });
  return generateTasks;
};

const listColumns: ListColumn[] = [
  {
    title: '序号',
    dataIndex: 'order',
    width: '20%',
    render: (text, record, index) => {
      const obj: RenderItem = {
        children: index / 2 + 1,
        props: {}
      };
      if (index % 2 === 0) {
        obj.props.rowSpan = 2;
      }
      if (index % 2 === 1) {
        obj.props.rowSpan = 0;
      }
      return obj;
    }
  },
  {
    title: '拆分任务',
    dataIndex: 'workTask',
    width: '80%',
    ellipsis: true,
    render: (text, record, index) => {
      const obj: RenderItem = {
        children: text || '-',
        props: {}
      };
      if (index % 2 === 0) {
        obj.props.rowSpan = 2;
      }
      if (index % 2 === 1) {
        obj.props.rowSpan = 0;
      }
      return obj;
    }
  }
];

export default function App() {
  const tasks: Task[] = getTasks(TASKS);
  return (
    <Gantt
      className={styles.container}
      tasks={tasks}
      locale='zh'
      barCornerRadius={10}
      listColumns={listColumns}
      columnWidth={24}
      rowHeight={24}
      barClassName={styles.barClassName}
      listCellWidth='300px'
      barFill={85}
      renderRowLines={(index: number) => index % 2 === 1}
    />
  );
}
