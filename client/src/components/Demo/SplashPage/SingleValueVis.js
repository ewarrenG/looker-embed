import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import AppContext from '../../../AppContext';
import { ApiHighlight } from '../../Highlights/Highlight';
import { Typography, Card, CardActionArea, CardActions, CardContent, CardMedia, Button, CircularProgress, Grid, Chip } from '@material-ui/core';
import { ResponsiveLine } from '@nivo/line';
const { validIdHelper, decodeHtml } = require('../../../tools');



export function SingleValueVis({ lookerContent, classes }) {
  // console.log('SingleValueVis')
  // console.log('lookerContent', lookerContent)
  // const [svg, setSvg] = useState(undefined)
  const [apiContent, setApiContent] = useState([]);
  const { userProfile, lookerUser } = useContext(AppContext)



  let dataObjForSparkline = {}
  useEffect(() => {
    if (lookerContent || lookerUser) {
      setTimeout(() => runInlineQuery(), 1000);
    }
  }, [lookerContent, lookerUser])



  const runInlineQuery = async () => {
    // console.log('runInlineQuery')
    setApiContent([])
    let stringifiedQuery = encodeURIComponent(JSON.stringify(lookerContent.inlineQuery))
    let lookerResponse = await fetch(`/runinlinequery/${stringifiedQuery}/${lookerContent.resultFormat}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let lookerResponseData = await lookerResponse.json();
    // console.log('lookerResponseData', lookerResponseData)
    dataObjForSparkline.id = validIdHelper(`singleVisValue-${lookerContent.id}`);
    dataObjForSparkline.data = [];

    let dataArrForDataObj = [];
    lookerResponseData.queryResults.map(item => {
      if (item[lookerContent.inlineQuery.fields[0]]
        // && item['order_items.count']['order_items.previous_period']["This Period" ? "This Period" : "Previous Period"]
      ) {
        let thisDataItem = {
          "x": item[lookerContent.inlineQuery.fields[0]].toString(),
          "y": item[lookerContent.inlineQuery.fields[1]] || 0,
          "change": item.change
        }
        if (thisDataItem && thisDataItem.y !== "null") dataArrForDataObj.push(thisDataItem)
      }
    })
    dataObjForSparkline.data = [...dataArrForDataObj]
    setApiContent([dataObjForSparkline])
  }

  const upOrDownArrow = apiContent.length ? isNaN((apiContent[0].data[0].change * 100).toFixed(2)) ? '' : parseInt((apiContent[0].data[0].change * 100).toFixed(0)) >= 0 ? `&uarr;` : `&darr;` : '';

  return (
    <Card elevation={1} className={classes.padding30}>
      <div
        className={`${classes.textCenter} ${classes.overflowHidden}`}
        style={
          // apiContent.length ? { borderLeft: `solid 3px ${lookerContent.visColor} `, height: lookerContent.height } : 
          { height: lookerContent.height }
        }
      >
        {apiContent.length ?
          <React.Fragment>
            <ApiHighlight height={150}>
              <Grid container>
                <Grid item sm={12}>
                  <Typography variant="body2" align="left" color="secondary">
                    {lookerContent.label}
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography variant="subtitle1" align="left">
                    <b>{apiContent[0].data && apiContent[0].data[0] ? parseInt(apiContent[0].data[0].y).toFixed(2) : ''}</b>
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Chip size="small"
                    label={`${decodeHtml(upOrDownArrow)} ${parseInt(apiContent[0].data[0].change * 100).toFixed(0)}% `}
                    className={isNaN((apiContent[0].data[0].change * 100).toFixed(2)) ? '' : parseInt((apiContent[0].data[0].change * 100).toFixed(0)) >= 0 ? classes.greenPos : classes.redNeg}
                    display="inline"
                    align="right"
                  />
                </Grid>
              </Grid>
              <ResponsiveLine
                data={apiContent}
                margin={{ top: 25, right: 25, bottom: 25, left: 25 }}
                xScale={{
                  type: 'time',
                  format: '%Y-%m-%d',
                  precision: 'day',
                }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                axisLeft={{
                  orient: "left",
                  tickSize: 0,
                  tickPadding: 5,
                  tickRotation: 0,
                  format: () => null
                }}
                axisBottom={{
                  orient: "bottom",
                  tickSize: 0,
                  tickPadding: 5,
                  tickRotation: 0,
                  format: () => null,
                  // legend: lookerContent.label,
                  // legendOffset: 15,
                  // legendPosition: 'middle'
                }}
                enablePoints={false}
                enableGridX={false}
                enableGridY={false}
                height={100}
                colors={lookerContent.visColor}
                animate={true}
              />
            </ApiHighlight>
          </React.Fragment>
          :
          <Grid item sm={12} className={`${classes.flexCentered}`} style={{ height: lookerContent.height }}>
            <CircularProgress className={classes.circularProgress}
              style={{ color: `${lookerContent.visColor} ` }} />
          </Grid>
        }
      </div >
    </Card>
  );
}