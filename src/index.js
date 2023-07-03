import { useRef, useEffect } from "react";

import { debounce } from 'lodash'

const CommandOperation = {
    WIN_UNDO: "ctrl+z",
    WIN_REDO: "ctrl+y",
}

const KeycodeMap = {
    90: 'z', // undo
    89: 'y', // redo操作
    67: 'c', // 复制操作
    86: 'v', // 粘贴操作
};


export default ({ listenKeyboard }) => {

    const commandMap = useRef({})

    const keyboardFlag = useRef(listenKeyboard)

    const currentCommandIndex = useRef(0)

    const commandQueue = useRef([])

    const setKeyboardFlag = (flag) => {
        keyboardFlag.current = flag
    }

    const registerCommand = (command) => {
        const { commandName, execute, label } = command
        const { redo, undo } = execute()
        const flag = typeof execute === 'function' && typeof redo === 'function' && typeof undo === 'function'
        if (!flag) {
            throw new Error('it is not function')
        }

        commandMap.current[commandName] = async (param) => {
            const { redo, undo } = execute(param)
            await redo()
            if (commandQueue.current.length > 0) {
                commandQueue.current = commandQueue.current.slice(0, currentCommandIndex.current + 1)
            }
            commandQueue.current.push({
                commandName,
                redo,
                undo,
                label
            })
            currentCommandIndex.current = commandQueue.current.length - 1
        }
    }

    const redo = async () => {
        const func = commandQueue.current[currentCommandIndex.current + 1]
        if (func) {
            await func.redo()
            currentCommandIndex.current = currentCommandIndex.current + 1
        }
    }

    const undo = async () => {
        if (currentCommandIndex.current < 0) return
        const func = commandQueue.current[currentCommandIndex.current]
        if (func) {
            await func.undo()
            currentCommandIndex.current = currentCommandIndex.current - 1
        }
    }


    // 键盘操作
    const keyboardAction = async function (e) {
        console.log(currentCommandIndex.current);
        if (currentCommandIndex.current < 0) return
        if (keyboardFlag.current) {

            const { metaKey, keyCode } = e;
            if (!metaKey) return
            const combinationKeycode = metaKey && `ctrl+${KeycodeMap[keyCode]}`

            switch (combinationKeycode) {
                case CommandOperation.WIN_UNDO:
                    await undo();
                    break
                case CommandOperation.WIN_REDO:
                    await redo();
                    break
            }
        }
    }

    const keyAction = debounce(keyboardAction, 200)

    const init = function (listenKeyboard) {
        if (listenKeyboard) {
            window.addEventListener('keydown', keyAction);
        }
    }


    useEffect(() => {
        init(listenKeyboard)

        return () => {
            window.removeEventListener('keydown', keyAction);
        }
    }, [])

    return {
        registerCommand,
        currentCommandIndex: currentCommandIndex.current,
        commandQueue: commandQueue.current,
        commandMap: commandMap.current,
        redo,
        undo,
        setKeyboardFlag
    }

}
