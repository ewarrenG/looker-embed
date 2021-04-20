import React, { useState } from 'react';
import { Typography, Grid, Switch } from '@material-ui/core'
import { EmbedHighlight } from '../Accessories/Highlight';

export const SwitchTheme = ({ classes, filterItem, helperFunctionMapper, lightThemeToggleValue, nativeFiltersThemeToggleValue }) => {

  // console.log("SwitchTheme")
  // console.log({ filterItem })
  // console.log({ lightThemeToggleValue })
  // console.log({ nativeFiltersThemeToggleValue })

  let HighlightComponent = filterItem.highlightComponent || EmbedMethodHighlight;
  let toggleValueToUse = filterItem.label === "Light or dark theme" ? lightThemeToggleValue : nativeFiltersThemeToggleValue;
  // console.log({ toggleValueToUse })

  return (
    <HighlightComponent classes={classes} >
      <Typography
      >{filterItem.options[toggleValueToUse]}</Typography>

      <Switch
        checked={!toggleValueToUse}
        onChange={(event, newValue) => {
          helperFunctionMapper(event, !event.target.checked, filterItem)
        }}
        color="primary"
        name="theme toggle"
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
    </HighlightComponent>
  )
}
