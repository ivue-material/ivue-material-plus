

// 判断参数是否是其中之一
export const oneOf = function (
    value: string,
    validList: Array<string>
) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true
        }
    }

    return false
}
