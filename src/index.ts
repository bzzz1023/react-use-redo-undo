import { useState } from "react";

interface ICommandMap {
  [propName: string]: (param: any) => any;
}

interface IExecuteFunc {
  (params: any): { redo: Function; undo: Function };
}

interface IRegisterCommandParams {
  commandName: string;
  execute: IExecuteFunc;
  label?: string;
}

interface ICommand {
  commandName: string;
  redo: Function;
  undo: Function;
  label?: string;
}

interface IExecuteReq {
  executeSuccess: boolean;
  params: any;
}

interface IExecuteRes {
  executeSuccess: boolean;
  params: any;
  commandName: string
}

const isObject = (obj: Object) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

function isAsyncFunction(fn: any) {
  return fn[Symbol.toStringTag] === "AsyncFunction";
}

const getSuccessFlag = (executeRes: IExecuteReq) => {
  if (executeRes === undefined) return true;
  if (executeRes.toString() === "true") return true;
  if (isObject(executeRes) && executeRes.executeSuccess) return true;
};

const getFailFlag = (executeRes: IExecuteReq) => {
  if (isObject(executeRes) && !executeRes.executeSuccess) return false;
  if (executeRes !== undefined && executeRes.toString() === "false")
    return false;
};

const useReactRedoUndo = () => {
  // 保存注册方法
  const [commandMap, setCommandMap] = useState<ICommandMap>({} as ICommandMap);

  // 执行下标
  let [executeIndex, setExecuteIndex] = useState<number>(-1);

  // 执行过的方法
  let [commandQueue, setCommandQueue] = useState<ICommand[]>([]);

  const registerCommand = (command: IRegisterCommandParams) => {
    const { commandName, execute, label } = command;
    commandMap[commandName] = (params: any) => {
      try {
        const { redo, undo } = execute(params);
        const executeFunc = (executeRes: IExecuteReq): IExecuteRes => {
          const successFlag = getSuccessFlag(executeRes);
          const failFlag = getFailFlag(executeRes);
          if (successFlag) {
            setExecuteIndex((preExecuteIndex: number) => {
              setCommandQueue((preCommandQueue) => {
                const newCommandQueue = preCommandQueue.slice(
                  0,
                  preExecuteIndex + 1
                );
                const newCommand = {
                  commandName,
                  redo,
                  undo,
                  label: label || commandName,
                };
                return [...newCommandQueue, newCommand];
              });
              return preExecuteIndex + 1;
            });
            return { executeSuccess: true, params, commandName };
          } else if (!failFlag) {
            return { executeSuccess: false, params, commandName };
          } else {
            const msg = `something is wrong with returned value`;
            throw new Error(`${msg}`);
          }
        };

        if (isAsyncFunction(redo)) {
          return new Promise((res) => {
            redo().then((data: any) => {
              res(executeFunc(data));
            });
          });
        } else {
          return executeFunc(redo());
        }
      } catch (error) {
        console.log(`${error}`);
      }
    };
    setCommandMap({ ...commandMap });
  }

  // 执行撤销or回退
  const executeRedoUndo = ({ type, executeRes, commandName }): IExecuteRes => {
    const successFlag = getSuccessFlag(executeRes);
    const failFlag = getFailFlag(executeRes);
    const customParams = (isObject(executeRes) && executeRes.params) || {};
    if (successFlag) {
      setExecuteIndex((preExecuteIndex: number) => {
        let executeType = {
          redo: 1,
          undo: -1
        }
        return preExecuteIndex + executeType[type];
      });
      return {
        executeSuccess: true,
        params: customParams,
        commandName,
      };
    } else if (!failFlag) {
      return {
        executeSuccess: false,
        params: customParams,
        commandName,
      };
    } else {
      const msg = `something is wrong with returned value`;
      throw new Error(`${msg}`);
    }
  };

  const redo = () => {
    try {
      const funcMap = commandQueue[executeIndex + 1];
      if (!funcMap) return;
      const { redo: redoFunc, commandName } = funcMap;
      if (isAsyncFunction(redoFunc)) {
        return new Promise((res) => {
          redoFunc().then((data: any) => {
            res(executeRedoUndo({
              type: "redo",
              executeRes: data,
              commandName
            }));
          });
        });
      } else {
        return executeRedoUndo({
          type: "redo",
          executeRes: redoFunc(),
          commandName
        });
      }
    } catch (error) {
      console.log(`Redo Error - ${error}`);
    }
  }

  const undo = () => {
    try {
      const funcMap = commandQueue[executeIndex];
      if (!funcMap) return;
      const { undo: undoFunc, commandName } = funcMap;

      if (isAsyncFunction(undoFunc)) {
        return new Promise((res) => {
          undoFunc().then((data: any) => {
            res(executeRedoUndo({
              type: "undo",
              executeRes: data,
              commandName
            }));
          });
        });
      } else {
        return executeRedoUndo({
          type: "undo",
          executeRes: undoFunc(),
          commandName
        });
      }
    } catch (error) {
      console.log(`Undo Error - ${error}`);
    }
  }

  return {
    registerCommand,
    executeIndex,
    commandQueue,
    commandMap,
    redo,
    undo,
  };
};

export default useReactRedoUndo;
