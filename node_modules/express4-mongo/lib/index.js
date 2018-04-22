// 数据库连接地址

const MongoClient = require('mongodb').MongoClient

var config = {}


/**
 * 新增数据方法
 * @param {JSON} data 新增数据
 * @param {Function} callback 回调
 */
function insert(data, callback) {
    MongoClient.connect(config.host, (err, client) => { // 选择主机
        if (err) {
            callback(err, false)
            return;
        }
        // 连起来
        client
            .db(config.database) // 选择数据库
            .collection(config.collectionName) // 选择集合
            .insert(data, function(err, result) { // 添加完成之后回调函数不会返回结果
                callback(err, result)

                // 数据连接关闭
                client.close()
            })

    })
}

/***************************************************************************************************************** */
/***************************************************************************************************************** */

/**
 * 更新方法
 * @param {JSON} query 查询条件 
 * @param {JSON} data 更新数据 
 * @param {JSON} ops
 */
function update(query, data, ops = {}, callback) {

    // 判断参数长度来决定谁是callback
    if (arguments.length === 3) {
        if (typeof ops == 'function') {
            callback = ops
        }
    }

    // 设置更新方式 如果有参数 默认用他自己的参数 如果没有 使用默认
    ops = {
        upsert: ops.upsert || false,
        multi: ops.multi || false
    }

    MongoClient.connect(config.host, (err, client) => { // 选择主机
        if (err) {
            if (typeof callback === 'function') {
                callback(err, false)
            }
            return;
        }
        // 连起来
        client
            .db(config.database) // 选择数据库
            .collection(config.collectionName) // 选择集合
            .update(query, { $set: data }, ops, function(err, result) { // 添加完成之后回调函数不会返回结果
                if (typeof callback === 'function') {
                    callback(err, result.result)
                }

                // 数据连接关闭
                client.close()
            })

    })
}

/***************************************************************************************************************** */
/***************************************************************************************************************** */


/**
 * 删除方法
 * @param {JSON} query 条件 
 * @param {Function} callback  回调
 */
function remove(query, callback) {
    if (arguments.length < 2) return;
    query = query || {}
    if (typeof callback != 'function') return;
    MongoClient.connect(config.host, (err, client) => { // 选择主机
        if (err) callback(null, arguments)
            // 连起来
        client
            .db(config.database) // 选择数据库
            .collection(config.collectionName) // 选择集合
            .remove(query, function(err, result) { // 添加完成之后回调函数不会返回结果
                callback(null, arguments)
                    // 数据连接关闭
                client.close()
            })

    })

}

/***************************************************************************************************************** */
/***************************************************************************************************************** */

/**
 * 查询方法
 * @param {JSON} query  查询条件
 * @param {JSON} ops   选项
 * @param {Function} callback 回调
 * @author ranyunlong <549510622@qq.com>
 * @returns {Arrary}
 */
function find() {
    // 错误排除 参数必须包含两个以上
    // 参数1 查询条件 可以为空{}
    // 参数2 可选 ops
    // 参数3 回调

    // 不够参数返回
    if (arguments.length < 2) return;

    // 够参数没有回调
    if (arguments.length == 2) {
        // 解构
        let [query, callback] = arguments
        // 如果query没有参数设置默认的{} 以免查询出错
        query = query || {}
            // callback 必须是回调函数
        if (typeof callback != 'function') return;

        MongoClient.connect(config.host, (err, client) => { // 选择主机
            if (err) callback.apply(null, arguments);
            client
                .db(config.database)
                .collection(config.collectionName)
                .find(query)
                .toArray(function() {
                    callback.apply(null, arguments)
                    client.close()
                })
        })
    }

    //够参数满足条件
    if (arguments.length == 3) {
        // 解构 arguments
        let [query, ops, callback] = arguments
        // 如果query没有参数设置默认的{} 以免查询出错
        query = query || {}
            // 如果ops没有参数设置默认的{} 以免查询出错
        ops = ops || {}

        // callback 必须是回调函数
        if (typeof callback != 'function') return;

        // 解构 ops
        const { limit, sort, skip } = ops

        // sort 查询时必须带条件 格式为
        //sort:{_id:-1} // 利用id排序 反向查询 
        //sort:{age:-1} // 利用age排序反向查询

        //Object.keys(ops) 查出ops的长度 判断是否要执行 limit skip sort 查询


        let opsLength = Object.keys(ops).length;

        // ops 选项长度值 执行不同的查询
        switch (opsLength) {
            case 0:
                // ops 有参数无值得情况下 使用正常查询
                MongoClient.connect(config.host, (err, client) => {
                    client
                        .db(config.database)
                        .collection(config.collectionName)
                        .find(query)
                        .toArray(function() {
                            callback.apply(null, arguments)
                            client.close()
                        })
                })
                break;
            case 1:
                // ops 只有一个参数的时候 使用 ops里面带的条件去查询
                // 例如：ops = { limit:1 } 限制查询1条
                let ops0 = Object.keys(ops)[0];

                //使用[ops0] = limit
                // ops[ops0] = 1

                // 这样也可以访问函数 
                // [ops0](ops[ops0]) = limit(1)
                MongoClient.connect(config.host, (err, client) => {
                    var db = client
                        .db(config.database)
                        .collection(config.collectionName)
                        .find(query)[ops0](ops[ops0])
                        .toArray(function() {
                            callback.apply(null, arguments)
                            client.close()
                        })

                })
                break;

            case 2:
                let opsKey = Object.keys(ops);
                MongoClient.connect(config.host, (err, client) => {
                    client
                        .db(config.database)
                        .collection(config.collectionName)
                        .find(query)[opsKey[0]](ops[opsKey[0]])[opsKey[1]](ops[opsKey[1]])
                        .toArray(function() {
                            callback.apply(null, arguments)
                            client.close()
                        })
                })
                break;

            case 3:
                MongoClient.connect(config.host, (err, client) => {
                    client
                        .db(config.database)
                        .collection(config.collectionName)
                        .find(query)
                        .skip(ops.skip)
                        .limit(ops.limit)
                        .sort(ops.sort)
                        .toArray(function() {
                            callback.apply(null, arguments)
                            client.close()
                        })
                })
                break;
        }



    }

}


/**
 * 
 * @param {String} name  集合名称
 */
function collection(name) {
    if (name) {
        // 查询完成之后要清理掉
        config.collectionName = name
        return {
            insert,
            update,
            remove,
            find
        }
    } else {
        console.log(`selected collection ${name}`)
    }
}

module.exports = (ops) => {
    config = {
        host: ops.host || 'mongodb://localhost:27017',
        database: ops.database || 'test'
    }
    return (req, res, next) => {
        req.db = {
            collection
        }
        next()
    }
}