### 查询优化
```
1.尽量避免全表扫描，首先应该考虑在where以及order by 涉及的列上建立聚集索引
2.尽量避免在where字句中使用！=或者<>，in，not in 操作符，否则引擎将放弃使用索引而进行全表扫描
3.尽量避免在where字句中对字段null值判断，否则引擎将放弃使用索引而进行全表扫描，可对字段赋默认值
4.尽量避免在where字句中使用or来链接条件，否则引擎将放弃使用索引而进行全表扫描
```