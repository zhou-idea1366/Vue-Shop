/*
 使用mockjs提供mock数据接口
 */
import Mock from 'mockjs'
import data from './data.json'   // webapck在打包会自动解析成对应的js对象/数组


Mock.mock( '/info', {code:0 , data:data.info })
Mock.mock( '/goods', {code:0 , data:data.goods })
Mock.mock( '/ratings', {code:0 , data:data.ratings })


//不需要向外暴露
console.log('mockServer.runing');
