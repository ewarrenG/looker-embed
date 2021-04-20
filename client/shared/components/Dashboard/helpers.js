import _ from 'lodash';
export const handleTileToggle = ({ newValue, filterItem, dashboardOptions }) => {
  // console.log("handleTileToggle")

  if (filterItem) {
    const filteredLayout = _.filter(dashboardOptions.layouts[0].dashboard_layout_components, (row) => {
      return (filterItem.tileLookUp[newValue].indexOf(dashboardOptions.elements[row.dashboard_element_id].title) > -1)
    })

    const newDashboardLayout = {
      ...dashboardOptions.layouts[0],
      dashboard_layout_components: filteredLayout
    }
    return {
      "methodName": filterItem.methodName,
      "response": {
        "layouts": [newDashboardLayout],
      }
    }
  }
};


export const handleVisColorToggle = ({ newValue, filterItem, dashboardOptions,
  isThemeableDashboard, lightThemeToggleValue } //would like to see these go away if possible
) => {

  // console.log("handleVisColorToggle")
  // console.log({ newValue })
  // console.log({ filterItem })
  // console.log({ dashboardOptions })

  if (filterItem) {
    let newColorSeries = filterItem.colors[newValue]
    let newDashboardElements = { ...dashboardOptions.elements };

    Object.keys(newDashboardElements).map(key => {
      if (newDashboardElements[key].vis_config.series_colors) {
        Object.keys(newDashboardElements[key].vis_config.series_colors).map((innerKey, index) => {
          newDashboardElements[key].vis_config.series_colors[innerKey] = newColorSeries[index] || newColorSeries[0];
        })
      }
      if (newDashboardElements[key].vis_config.custom_color) {
        newDashboardElements[key].vis_config.custom_color = newColorSeries[newColorSeries.length - 2];
      }
      if (newDashboardElements[key].vis_config.map_value_colors) {
        newDashboardElements[key].vis_config.map_value_colors.map((item, index) => {
          newDashboardElements[key].vis_config.map_value_colors[index] = newColorSeries[index] || newColorSeries[0];
        })
      }
      // loss some fidelity here
      if (newDashboardElements[key].vis_config.series_cell_visualizations) {
        Object.keys(newDashboardElements[key].vis_config.series_cell_visualizations).map((innerKey, index) => {
          if (newDashboardElements[key].vis_config.series_cell_visualizations[innerKey].hasOwnProperty("palette")) {
            newDashboardElements[key].vis_config.series_cell_visualizations[innerKey]["palette"] = { ...filterItem.series_cell_visualizations[newValue] }
          }
        })
      }
      if (newDashboardElements[key].vis_config.header_font_color) {
        newDashboardElements[key].vis_config.header_font_color = newColorSeries[newColorSeries.length - 2];
      }
      if (isThemeableDashboard) {
        if (newDashboardElements[key].vis_config.map_tile_provider) {
          newDashboardElements[key].vis_config.map_tile_provider = lightThemeToggleValue ? "light" : "dark";
        }

      }
    })
    return {
      "methodName": filterItem.methodName,
      "response": {
        "elements": { ...newDashboardElements }
      }
    }
  }
}

export const handleThemeChange = ({ newValue, filterItem, lightThemeToggleValue, fontThemeSelectValue, packageName, nativeFiltersThemeToggleValue }) => {
  // console.log("handleThemeChange")
  // console.log({ newValue })
  // console.log({ filterItem })
  // console.log({ fontThemeSelectValue })
  // console.log({ lightThemeToggleValue })
  // console.log({ nativeFiltersThemeToggleValue })

  let themeName = '';
  if (filterItem.label === "Light or dark theme") {
    themeName = newValue ? `${packageName}_light_${fontThemeSelectValue}` : `${packageName}_dark_${fontThemeSelectValue}`
  } else if (filterItem.label === "Change font") {
    themeName = lightThemeToggleValue ? `${packageName}_light_${newValue}` : `${packageName}_dark_${newValue}`
  } else if (filterItem.label === "Show or hide native filters") {
    themeName = newValue ? `${packageName}_light_${fontThemeSelectValue}_filters` : `${packageName}_light_${fontThemeSelectValue}`
  }

  // console.log({ themeName })

  return {
    "methodName": filterItem.methodName,
    "response": themeName
  }
}


export const runInlineQuery = async ({ sdk, item, lookerUser }) => { //type
  // console.log("runInlineQuery")
  // console.log({ item })

  let jsonQuery = item.inlineQuery
  jsonQuery.filters = {
    ...jsonQuery.filters,
    [item.desiredFilterName]: lookerUser.user_attributes.brand
  };
  let lookerResponseData = await sdk.ok(sdk.run_inline_query({ result_format: item.resultFormat || 'json', body: jsonQuery }));
  return lookerResponseData;
}

export const createCase = async ({ newValue, filterItem, hiddenFilterValue }) => {
  // console.log("createCase")
  // console.log({ newValue })
  // console.log({ filterItem })

  let newCaseResponse = await fetch('/createcase', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ caseType: newValue, applicationId: hiddenFilterValue })
  })
  const newCaseResponseData = await newCaseResponse.json();
  newCaseResponseData.showSnackbar = true

  return {
    "methodName": filterItem.methodName,
    "response": newCaseResponseData,
  };
}

export const addCaseNotes = async ({ newValue, filterItem, hiddenFilterValue }) => {
  // console.log("addCaseNotes")
  // console.log({ newValue })
  // console.log({ filterItem })
  // console.log({ hiddenFilterValue })

  let newCaseResponse = await fetch('/addcasenotes', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ caseNote: newValue, caseId: hiddenFilterValue })
  })
  const newCaseResponseData = await newCaseResponse.json();
  newCaseResponseData.showSnackbar = true

  // console.log({ newCaseResponseData })

  return {
    "methodName": filterItem.methodName,
    "response": newCaseResponseData,
  };
}

export const changeCaseStatus = async ({ newValue, filterItem, hiddenFilterValue }) => {
  // console.log("changeCaseStatus")
  // console.log({ newValue })
  // console.log({ filterItem })
  // console.log({ hiddenFilterValue })

  let changeCaseStatusResponse = await fetch('/changecasestatus', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ caseStatus: newValue, caseId: hiddenFilterValue })
  })
  const changeCaseStatusResponseData = await changeCaseStatusResponse.json();
  // console.log({ changeCaseStatusResponseData })
  changeCaseStatusResponseData.showSnackbar = true

  return {
    "methodName": filterItem.methodName,
    "response": changeCaseStatusResponseData,
  };
}

export const formatApiResultsForAutoComplete = ({ rawApiResults }) => {
  let dropdownResults = [];
  let desiredProperty = Object.keys(rawApiResults[0])[0];

  for (let i = 0; i < rawApiResults.length; i++) {
    dropdownResults.push({
      'label': rawApiResults[i][desiredProperty],
      'trend': (rawApiResults[i]['trend']) ? rawApiResults[i]['trend'] : undefined,
      'count': (rawApiResults[i]['count']) ? rawApiResults[i]['count'] : undefined
    })
  }

  return dropdownResults;
}

export const formatApiResultsForTrends = ({ rawApiResults, filterItem, filterItem: { fieldsOfInterest } }) => {
  // console.log("formatApiResultsForTrends")
  // console.log({ rawApiResults })
  // console.log({ filterItem })
  const firstApiResultOfInterest = rawApiResults[0][fieldsOfInterest[0]][fieldsOfInterest[1]];
  const firstApiResultOfInterestAsArr = Object.keys(firstApiResultOfInterest).map(key => {
    return {
      key: key,
      value: firstApiResultOfInterest[key]
    }
  })
  return firstApiResultOfInterestAsArr
}