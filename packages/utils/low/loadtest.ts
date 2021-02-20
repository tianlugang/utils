const fs = require('fs')
const pa = require('path')
const now = Date.now();

function runnerTest(target, loadtest) {
    loadtest.loadTest(Object.assign({}, target), function (err, result) {
        if (err) {
            throw err
        }

        const rsFilePath = pa.join(__dirname, './', 't_' + now + '.json')
        const rsContent = JSON.stringify(result, null, 4)
        fs.writeFileSync(rsFilePath, rsContent)
    })
}



export default function (apiList) {
    try {

        const loadtest = require('loadtest')
        for (const target of apiList) {
            runnerTest(target, loadtest)
        }
    } catch (error) {
        throw error;
    }
}

