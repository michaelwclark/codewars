var query = function() {
    const DefaultQueryState = {
    fromWhat: [],
    selectCalled:false,
    selectField: (x) => x,
    whereFunction: () => true,
    groupByFunction: () => {},
    orderByFunction: () => {}
  }

  return Object.assign(DefaultQueryState, {
    select: selectBuilder(DefaultQueryState),
    from: fromBuilder(DefaultQueryState),
    execute: executeBuilder(DefaultQueryState),
    where: whereBuilder(DefaultQueryState),
    groupBy: groupByBuilder(DefaultQueryState),
    orderBy: orderByBuilder(DefaultQueryState),
    })
}

const groupByBuilder =
  QueryState =>
    (...fns) => {
      const groupedObj = {}

      const getUniqueValuesForFields = makeGetUniqueValuesForFields(QueryState)

      return Object.assign(QueryState, {fromWhat: getUniqueValuesForFields(fns)})
      //get uniqueValues for fields

    }

const makeGetUniqueValuesForFields =
  QueryState =>
    fns => {
      const fn=fns[0]
      const valuesObj = QueryState.fromWhat.reduce((accumulator, current) => {
        const currentFieldVal = fn(current)
        if(!accumulator[currentFieldVal]){
          Object.assign(accumulator, {[currentFieldVal] : [] })
        }
        const pushAcc = accumulator[ currentFieldVal ]
        pushAcc.push(current)
        Object.assign(accumulator, { [ currentFieldVal ]: pushAcc })
        return accumulator
      }, {})
      const keyArray = Object.keys(valuesObj).map(key=> key)
      return keyArray.map(key=>[key, valuesObj[key]])
    }

const whereBuilder =
  QueryState =>
    whereFunction =>
      Object.assign(QueryState, {whereFunction: whereFunction || QueryState.whereFunction})


const selectBuilder =
  QueryState =>
    selectField =>
      Object.assign(QueryState, {selectField: selectField || QueryState.selectField, selectCalled:true})

const fromBuilder =
  QueryState =>
    fromWhat =>
      Object.assign(QueryState, {fromWhat: fromWhat || []})

const orderByBuilder =
  QueryState =>
    orderByFunction =>
      Object.assign(QueryState, {orderByFunction})

const executeBuilder =
  QueryState =>
    () =>
      QueryState.fromWhat
      .sort(QueryState.orderByFunction)
      .filter(QueryState.whereFunction)
      .map(QueryState.selectField)


export default query
