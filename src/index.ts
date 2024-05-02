import { useEffect, useRef, useState, useCallback } from "react";

interface ICommandMap {
  [propName: string]: (param: any) => any;
}

interface IExecuteFunc {
  (params: any): { redo: Function; undo: Function };
}

interface ICommandParams {
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

interface IExecuteRes {
  executeSuccess: boolean;
  params: any;
}

const isObject = (obj: Object) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

function isAsyncFunction(fn: any) {
  return fn[Symbol.toStringTag] === "AsyncFunction";
}

const getSuccessFlag = (executeRes: IExecuteRes) => {
  if (executeRes === undefined) return true;
  if (executeRes.toString() === "true") return true;
  if (isObject(executeRes) && executeRes.executeSuccess) return true;
};

const getFailFlag = (executeRes: IExecuteRes) => {
  if (isObject(executeRes) && !executeRes.executeSuccess) return false;
  if (executeRes !== undefined && executeRes.toString() === "false")
    return false;
};

const useReactRedoUndo = () => {
  // 保存注册方法
  const [commandMap, setCommandMap] = useState<ICommandMap>({} as ICommandMap);

  // 执行下标
  let [executeIndex, setExecuteIndex] = useState(-1);

  // 执行过的方法
  let [commandQueue, setCommandQueue] = useState<ICommand[]>([]);

  const registerCommand = useCallback((command: ICommandParams) => {
    const { commandName, execute, label } = command;
    commandMap[commandName] = (params: any) => {
      try {
        const { redo, undo } = execute(params);
        const executeFunc = (executeRes: IExecuteRes) => {
          const successFlag = getSuccessFlag(executeRes);
          const failFlag = getFailFlag(executeRes);
          if (successFlag) {
            setExecuteIndex((preExecuteIndex: number) => {
              setCommandQueue((preCommandQueue: ICommand[]) => {
                const newCommandQueue = preCommandQueue.slice(
                  0,
                  preExecuteIndex + 1
                );
                const newCommand = {
                  commandName,
                  redo,
                  undo,
                  label,
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
  }, []);

  const redo = useCallback(() => {
    try {
      const funcMap = commandQueue[executeIndex + 1];
      if (!funcMap) return;
      const { redo, commandName } = funcMap;
      const executeFunc = (executeRes: IExecuteRes) => {
        const successFlag = getSuccessFlag(executeRes);
        const failFlag = getFailFlag(executeRes);
        const customParams = (isObject(executeRes) && executeRes.params) || {};
        if (successFlag) {
          setExecuteIndex((preExecuteIndex) => {
            return preExecuteIndex + 1;
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
      console.log(`Redo Error - ${error}`);
    }
  }, [commandQueue, executeIndex]);

  const undo = useCallback(() => {
    try {
      const funcMap = commandQueue[executeIndex];
      if (!funcMap) return;
      const { undo, commandName } = funcMap;
      const executeFunc = (executeRes: IExecuteRes) => {
        const successFlag = getSuccessFlag(executeRes);
        const failFlag = getFailFlag(executeRes);
        const customParams = (isObject(executeRes) && executeRes.params) || {};
        if (successFlag) {
          setExecuteIndex((preExecuteIndex: number) => {
            return preExecuteIndex - 1;
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

      if (isAsyncFunction(undo)) {
        return new Promise((res) => {
          undo().then((data: any) => {
            res(executeFunc(data));
          });
        });
      } else {
        return executeFunc(undo());
      }
    } catch (error) {
      console.log(`Undo Error - ${error}`);
    }
  }, [commandQueue, executeIndex]);

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
