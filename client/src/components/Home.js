
import $ from 'jquery';
import _ from 'lodash'
import React, { Component } from 'react'
import clsx from 'clsx';
import { withStyles } from "@material-ui/core/styles";
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar'
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { blue, green, orange, indigo, red } from '@material-ui/core/colors';

import UserMenu from './Material/UserMenu';
import { LookerEmbedSDK } from '@looker/embed-sdk'
import UsecaseContent from '../usecaseContent.json';
import SplashPage from './Demo/SplashPage';
import ReportBuilder from './Demo/ReportBuilder';
import QueryBuilder from './Demo/QueryBuilder';
import ComingSoon from './Demo/ComingSoon';
import Dashboard from './Demo/Dashboard';

const drawerWidth = 240;
const { validIdHelper } = require('../tools');

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    title: {
        flexGrow: 1,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    dNone: {
        display: 'none'
    },
    dBlock: {
        display: 'block'
    },
    relative: {
        position: 'relative'
    },
    absolute: {
        position: 'absolute'
    },
    right0: {
        right: 0
    },
    top0: {
        top: 0
    },
    right24: {
        right: 24
    },
    top24: {
        top: 24
    },
    ml12: {
        marginLeft: 12
    }
});

const defaultTheme = createMuiTheme({})
const ecommTheme = createMuiTheme({
    palette: {
        primary: {
            main: indigo[500],
        },
        typography: {
            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
            fontSize: 14,
        }
    }
})

const recruitingTheme = createMuiTheme({
    palette: {
        primary: {
            main: red[500],
        },

        typography: {
            fontFamily: [
                "Courier New", "Courier", "Monaco"
            ]
        }
    },
})

const insuranceTheme = createMuiTheme({
    palette: {
        primary: {
            main: orange[500],
        },
    },
})


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            drawerOpen: true,
            drawerTabValue: 0,
            activeTabValue: 0,
            sampleCode: {},
            activeUsecase: '',
        }
    }

    //material  methods for layout
    handleDrawerTabChange = (event, newValue) => {

        this.handleDrawerChange(true);

        if (newValue > 0) {

            const contenttype = $("#drawerTabs button")[newValue].getAttribute('contenttype')
            const sampleCodeFilePath = require(`../sample-code/${contenttype}.sample.txt`);
            fetch(sampleCodeFilePath)
                .then(response => {
                    return response.text()
                })
                .then(text => {
                    this.setState({
                        drawerTabValue: newValue,
                        sampleCode: text
                    }, () => {
                        this.handleTabChange(0)
                    })
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        } else {
            this.setState({
                drawerTabValue: newValue
            }, () => {
                this.handleTabChange(0)
            })
        }
    };

    handleTabChange = newValue => {
        // console.log('handleTabChange')
        // console.log('newValue', newValue)
        // console.log('this.state.activeTabValue', this.state.activeTabValue)
        // console.log('this.state.drawerTabValue', this.state.drawerTabValue)

        if (newValue === 0
            && this.state.activeTabValue !== newValue
            && this.state.drawerTabValue === 4) {
            let usecaseFromUrl = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
            this.setupLookerContent([UsecaseContent[usecaseFromUrl].demoComponents[this.state.drawerTabValue]]);

        }

        this.setState({
            activeTabValue: newValue
        })
    }

    handleDrawerChange = (open) => {
        this.setState({
            drawerOpen: open
        })
    }




    componentDidMount(props) {
        // console.log('Home componentDidMount');
        let usecaseFromUrl = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
        this.setState({
            activeUsecase: usecaseFromUrl
        }, () => {
            // console.log('callback')
            // console.log('this.state.activeUsecase', this.state.activeUsecase)
            LookerEmbedSDK.init(`${this.props.lookerHost}.looker.com`, '/auth');
            this.setupLookerContent(UsecaseContent[usecaseFromUrl].demoComponents);
        })
    }

    // think about refactor to make more efficient 
    // promise.all()
    async setupLookerContent(usecaseContent) {
        // console.log('setupLookerContent')
        // console.log('usecaseContent', usecaseContent)

        //delete old content
        let embedContainerArray = []
        if (usecaseContent.length > 1) {
            embedContainerArray = document.getElementsByClassName("embedContainer:visble");
        } else {
            embedContainerArray = document.getElementsByClassName("embedContainer")
        }
        // console.log('embedContainerArray', embedContainerArray)

        for (let h = 0; h < embedContainerArray.length; h++) {
            let thisEmbedContainerId = embedContainerArray[h].id
            document.getElementById(thisEmbedContainerId).innerHTML = ''
        }

        let objForState = {}
        for (let j = 0; j < usecaseContent.length; j++) {
            for (let i = 0; i < usecaseContent[j].lookerContent.length; i++) {
                if (usecaseContent[j].lookerContent[i].type === 'dashboard') {
                    let dashboardId = usecaseContent[j].lookerContent[i].id;
                    LookerEmbedSDK.createDashboardWithId(usecaseContent[j].lookerContent[i].id)
                        .appendTo(validIdHelper(`#embedContainer-${usecaseContent[j].type}-${dashboardId}`))
                        .withClassName('iframe')
                        .withNext()
                        .withTheme('Looker')
                        .on('drillmenu:click', (event) => typeof this[_.camelCase(usecaseContent[j].type) + 'Action'] === 'function' ? this[_.camelCase(usecaseContent[j].type) + 'Action'](event) : '')
                        .build()
                        .connect()
                        .then((dashboard) => {
                            // console.log('then callback dashboardId', dashboardId)
                            // if (dashboardId) objForState[dashboardId] = dashboard; //not working
                            if (dashboardId) {
                                this.setState({
                                    [dashboardId]: dashboard
                                })
                            }
                        })
                        .catch((error) => {
                            console.error('Connection error', error)
                        })

                    if (usecaseContent[j].lookerContent[i].hasOwnProperty('filter')) {
                        let stringifiedQuery = encodeURIComponent(JSON.stringify(usecaseContent[j].lookerContent[i].filter.inlineQuery))
                        let lookerResponse = await fetch('/runinlinequery/' + stringifiedQuery + '/json', {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            }
                        })
                        let lookerResponseData = await lookerResponse.json();

                        let inlineQueryField = usecaseContent[j].lookerContent[i].filter.inlineQuery.fields[0]
                        for (i = 0; i < lookerResponseData.queryResults.length; i++) {
                            lookerResponseData.queryResults[i].label = lookerResponseData.queryResults[i][inlineQueryField];
                            delete lookerResponseData.queryResults[i][inlineQueryField];
                        }

                        const stateKey = _.camelCase(usecaseContent[j].type) + 'ApiContent'; //customFilterApiContent
                        objForState[stateKey] = lookerResponseData.queryResults;
                    }

                } else if (usecaseContent[j].lookerContent[i].type === 'explore') {
                    let exploreId = usecaseContent[j].lookerContent[i].id
                    // console.log('exploreId', exploreId)
                    LookerEmbedSDK.createExploreWithId(usecaseContent[j].lookerContent[i].id)
                        .appendTo(validIdHelper(`#embedContainer-${usecaseContent[j].type}-${usecaseContent[j].lookerContent[i].id}`))
                        .withClassName('iframe')
                        .on('explore:state:changed', (event) => {
                            // console.log('explore:state:changed')
                            // console.log('event', event)
                        })
                        // .withParams({
                        //     qid: 'QBtnsUlBRDctxq5jSWmksJ',
                        //     toggle: 'dat,pik,vis'
                        // })
                        .build()
                        .connect()
                        .then((explore) => {
                            // // console.log('explore then callback')
                            // if (exploreId) {
                            //     // console.log('inside ifff')
                            //     this.setState({
                            //         [validIdHelper(exploreId)]: explore
                            //     })
                            // }
                        })
                        .catch((error) => {
                            console.error('Connection error', error)
                        })

                } else if (usecaseContent[j].lookerContent[i].type === 'folder') {
                    // console.log('inside folder else ifff');
                    let lookerResponse = await fetch('/fetchfolder/' + usecaseContent[j].lookerContent[i].id, { //+ usecaseContent[j].type + '/'
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })

                    let lookerResponseData = await lookerResponse.json();
                    let looksToUse = [...lookerResponseData.sharedFolder.looks, ...lookerResponseData.embeddedUserFolder.looks]
                    let dashboardsToUse = [...lookerResponseData.sharedFolder.dashboards]
                    let objToUse = {
                        looks: looksToUse,
                        dashboards: dashboardsToUse
                    }

                    if (objToUse.looks.length) {
                        objToUse.looks.map((item, index) => {
                            let lookId = item.id
                            LookerEmbedSDK.createLookWithId(lookId)
                                .appendTo(validIdHelper(`#embedContainer-${usecaseContent[j].type}-${usecaseContent[j].lookerContent[i].id}`))
                                .withClassName('iframe')
                                .withClassName('look')
                                .withClassName(lookerResponseData.sharedFolder.looks.indexOf(item) > -1 ? "shared" : "personal")
                                .withClassName(index > 0 ? 'd-none' : 'oops')
                                .withClassName(lookId)
                                // .on('drillmenu:click', (e) => this.drillClick(e))
                                // .on('drillmodal:look', (event) => {
                                //     console.log('drillmodal:look')
                                //     console.log('event', event)
                                // })
                                // .on('drillmodal:explore', (event) => {
                                //     console.log('drillmodal:explore')
                                //     console.log('event', event)
                                // })
                                .build()
                                .connect()
                                .then(this.setupLook)
                                .catch((error) => {
                                    console.error('Connection error', error)
                                })
                        })
                    }

                    if (objToUse.dashboards.length) {
                        objToUse.dashboards.map((item, index) => {
                            let dashboardId = item.id
                            LookerEmbedSDK.createDashboardWithId(dashboardId)
                                .appendTo(validIdHelper(`#embedContainer-${usecaseContent[j].type}-${usecaseContent[j].lookerContent[i].id}`))
                                .withClassName('iframe')
                                .withClassName('dashboard')
                                .withClassName(lookerResponseData.sharedFolder.dashboard.indexOf(item) > -1 ? "shared" : "personal")
                                // .on('drillmenu:click', (e) => this.drillClick(e))
                                .build()
                                .connect()
                                .then(this.setupLook)
                                .catch((error) => {
                                    console.error('Connection error', error)
                                })
                        })
                    }

                    const stateKey = _.camelCase(usecaseContent[j].type) + 'ApiContent';
                    objForState[stateKey] = objToUse; //[...looksToUse, ...dashboardsToUse]; //objToUse;

                } else if (usecaseContent[j].lookerContent[i].type === "api") {
                    // console.log('inside elllse if for api')
                    // console.log('usecaseContent[j].lookerContent[i].id', usecaseContent[j].lookerContent[i].id)
                    let lookerResposnse = await fetch('/runquery/' + usecaseContent[j].lookerContent[i].id + '/' + usecaseContent[j].lookerContent[i].resultFormat, {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        }
                    })
                    let lookerResponseData = await lookerResposnse.json();
                    const stateKey = _.camelCase(usecaseContent[j].type) + 'ApiContent';
                    // this gives better performance...
                    this.setState((prevState) => ({
                        [stateKey]: prevState[stateKey] ? [...prevState[stateKey], { 'glance': lookerResponseData }] : [{ 'glance': lookerResponseData }]
                    }), () => {
                        if (lookerResponseData.queryResults.errors) {
                        } else if (lookerResponseData.queryResults.data[0]) //for now
                            this.splashPageDetail(lookerResponseData.queryResults.data[0][usecaseContent[j].lookerContent[i].desiredProperty].links[0].url, i)

                    })

                    // use state for this for now for better loading experience
                    // if (objForState.hasOwnProperty(stateKey)) {
                    //     objForState[stateKey].push({ 'glance': lookerResponseData })
                    // } else {
                    //     objForState[stateKey] = [{ 'glance': lookerResponseData }]
                    // }

                } else if (usecaseContent[j].lookerContent[i].type === "explorelite") {
                    this.queryBuilderAction(usecaseContent[j].lookerContent[i].queryBody, usecaseContent[j].lookerContent[i].resultFormat)

                } else { console.log('catch all else') }
            }

        }

        // set state once after loop to reduce renders
        //not working, or is it???
        setTimeout(() => {
            // console.log('objForState', objForState)
            this.setState((prevState) => ({
                ...prevState,
                ...objForState
            }), () => {
                // console.log('setState callback', this.state)
            })
        }, 1000)
    }

    splashPageDetail = async (sharedUrl, index) => {
        console.log('splashPageDetail')
        console.log('sharedUrl', sharedUrl)
        // console.log('index', index)
        let parsedUrl = new URL(`https://${this.props.lookerHost}.looker.com${sharedUrl}`);
        let splashPageApiContentCopy;
        if (parsedUrl.pathname.split('/')[1] === "explore") {
            let filters = parsedUrl.search.match(/(?<=&f\[).+?(?=\])/g);
            let filtersObj = {}
            filters.forEach(item => {
                filtersObj[item] = parsedUrl.searchParams.get(`f[${item}]`)
            })
            let newQueryParams = {
                model: parsedUrl.pathname.split('/')[2],
                view: parsedUrl.pathname.split('/')[3],
                fields: parsedUrl.searchParams.get("fields").split(","),
                filters: filtersObj,
                total: true,
                limit: "25"
            }

            // console.log('newQueryParams', newQueryParams)

            let lookerResponse = await fetch('/runinlinequery/' + JSON.stringify(newQueryParams) + '/json', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            let lookerResponseData = await lookerResponse.json();
            splashPageApiContentCopy = [...this.state.splashPageApiContent]
            splashPageApiContentCopy[index].detail = lookerResponseData.queryResults;

        } else {
            splashPageApiContentCopy = [...this.state.splashPageApiContent]
            splashPageApiContentCopy[index].detail = [];
        }
        this.setState({
            splashPageApiContent: splashPageApiContentCopy
        })

    }

    customFilterAction = (newFilterValue, stateName, filterName) => {
        // console.log('customFilterAction')
        // console.log('event', event)
        // console.log('newFilterValue', newFilterValue)
        // console.log('stateName', stateName)
        // console.log('filterName', filterName)

        this.setState({}, () => {
            this.state[stateName].updateFilters({ [filterName]: newFilterValue })
            this.state[stateName].run()
        })

    }

    //seemes to be non performant, need to think of a new solution...
    reportBuilderAction = async (lookId, secondaryAction, qid, exploreId, newReportEmbedContainer) => {
        // console.log('reportBuilderAction')
        // console.log('lookId', lookId)
        // console.log('secondaryAction', secondaryAction)
        // console.log('qid', qid)
        // console.log('exploreId', exploreId)
        // console.log('newReportEmbedContainer', newReportEmbedContainer)

        let iFrameArray = $(".embedContainer:visible > iframe")

        let matchingIndex = 0;
        for (let i = 0; i < iFrameArray.length; i++) {
            if (iFrameArray[i].classList.contains(lookId)) {
                iFrameArray[i].classList.remove('d-none')
                matchingIndex = i;
            } else {
                iFrameArray[i].classList.add('d-none')
            }
        }

        if (secondaryAction === 'edit') {
            $(`#${newReportEmbedContainer}`).empty();

            LookerEmbedSDK.createExploreWithId(exploreId)
                .appendTo(`#${newReportEmbedContainer}`)
                .withClassName('iframe')
                .on('explore:state:changed', (event) => {
                    // console.log('explore:state:changed')
                    // console.log('event', event)
                })
                .withClassName("exploreIframe")
                .withParams({
                    qid: qid,
                    // toggle: 'dat,pik,vis'
                })
                .build()
                .connect()
                .then((explore) => {
                    // console.log('explore then callback')
                })
                .catch((error) => {
                    console.error('Connection error', error)
                })


            this.handleTabChange(1) //can assume one for now
        }
        else if (secondaryAction === 'delete') {

            let lookerResponse = await fetch('/deletelook/' + lookId, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (lookerResponse.status === 200) {
                // console.log("inside 200 ifff")
                let reportBuilderApiContentCopy = this.state.reportBuilderApiContent;
                reportBuilderApiContentCopy.looks.splice(matchingIndex, 1)
                this.setState({
                    reportBuilderApiContent: reportBuilderApiContentCopy
                }, () => {
                    // console.log('callback this.state.reportBuilderApiContent', this.state.reportBuilderApiContent)
                })
            }
        } else if (secondaryAction === 'explore') {
            $(`#${newReportEmbedContainer}`).empty();

            LookerEmbedSDK.createExploreWithId(exploreId)
                .appendTo(`#${newReportEmbedContainer}`)
                .withClassName('iframe')
                .on('explore:state:changed', (event) => {
                    // console.log('explore:state:changed')
                    // console.log('event', event)
                })
                .withClassName("exploreIframe")
                .withParams({
                    qid: qid,
                    // toggle: 'dat,pik,vis'
                })
                .build()
                .connect()
                .then((explore) => {
                    // console.log('explore then callback')
                })
                .catch((error) => {
                    console.error('Connection error', error)
                })


            this.handleTabChange(1) //can assume one for now

        }
    }



    // drillClick(event) {
    dashboardOverviewDetailAction(event) {
        // console.log('dashboardOverviewDetailAction')
        // console.log('event', event)
        const isCampaignPerformanceDrill = (event.label === 'Campaign Performance Dashboard') ? true : false;
        if (isCampaignPerformanceDrill) {
            // const parsedUrl = new URL(event.url)
            // const stateName = decodeURIComponent(parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf('/') + 1, parsedUrl.pathname.length))
            // const filterName = decodeURIComponent(parsedUrl.search.substring(1, parsedUrl.search.indexOf('=')))
            // const filterValue = decodeURIComponent(parsedUrl.search.substring(parsedUrl.search.indexOf('=') + 1, parsedUrl.search.length))

            const url = event.url;
            let stateName = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1, url.indexOf('?')));
            const filterName = decodeURIComponent(url.substring(url.indexOf('?') + 1, url.indexOf('=')));
            const filterValue = decodeURIComponent(url.substring(url.lastIndexOf('=') + 1, url.length));


            if (stateName === 'pwSkck3zvGd1fnhCO7Fc12') stateName = 3106; // hack for now...
            //urls changed to relative, need slugs to work across instances?

            // console.log('stateName', stateName)
            // console.log('filterName', filterName)
            // console.log('filterValue', filterValue)


            this.setState({}, () => {
                this.state[stateName].updateFilters({ [filterName]: filterValue })
                this.state[stateName].run()
            })

            this.handleTabChange(1) //can assume one for now
            return { cancel: (isCampaignPerformanceDrill) ? true : false }

        }
    }

    queryBuilderAction = async (newQuery, resultFormat) => {
        // console.log('queryBuilderAction');
        // console.log('newQuery', newQuery);
        // console.log('resultFormat', resultFormat);

        /*this.setState({
            'queryBuilderApiContent': 0
        })*/

        let queryBuilderApiContent = { ...this.state.queryBuilderApiContent }
        queryBuilderApiContent.status = 'running';
        this.setState({ queryBuilderApiContent })

        let lookerCreateTaskResposnse = await fetch('/createquerytask/' + JSON.stringify(newQuery), {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let lookerCreateTaskResponseData = await lookerCreateTaskResposnse.json();
        // console.log('lookerCreateTaskResponseData', lookerCreateTaskResponseData)

        let taskInterval = setInterval(async () => {
            let lookerCheckTaskResposnse = await fetch('/checkquerytask/' + lookerCreateTaskResponseData.queryTaskId, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            let lookerCheckTaskResponseData = await lookerCheckTaskResposnse.json();
            // console.log('lookerCheckTaskResponseData', lookerCheckTaskResponseData)
            // console.log('lookerCheckTaskResponseData.queryResults.data', lookerCheckTaskResponseData.queryResults.data)

            if (lookerCheckTaskResponseData.queryResults.status === 'complete') {
                // console.log('inside ifff')
                clearInterval(taskInterval)
                this.setState({
                    'queryBuilderApiContent': lookerCheckTaskResponseData.queryResults
                })
            }
        }, 1000)
    }

    render() {
        // console.log('Home render');
        // console.log('this.state', this.state);
        // console.log('this.props', this.props);

        const demoComponentMap = {
            "splash page": SplashPage,
            "custom filter": Dashboard,
            "dashboard overview detail": Dashboard,
            "report builder": ReportBuilder,
            "query builder": QueryBuilder,
            "custom viz": ComingSoon,
            "simple dashboard": Dashboard
        }
        const themeMap = {
            "ecomm": ecommTheme,
            "recruiting": recruitingTheme,
            "insurance": insuranceTheme
        }

        const { drawerTabValue, drawerOpen, activeTabValue, sampleCode, activeUsecase } = this.state;
        const { handleDrawerChange, handleDrawerTabChange, handleTabChange } = this;
        const { classes, activeCustomization, switchLookerUser, lookerUser, applySession } = this.props

        // console.log('activeUsecase', activeUsecase)
        // console.log('themeMap[activeUsecase]', activeUsecase ? themeMap[activeUsecase] : '')

        // console.log('drawerTabValue', drawerTabValue);
        // console.log('sampleCode', sampleCode);
        // console.log('activeUsecase', activeUsecase);

        return (
            <div className={classes.root}>

                <ThemeProvider theme={activeUsecase ? themeMap[activeUsecase] : defaultTheme}>
                    <CssBaseline />
                    <AppBar
                        position="fixed"
                        className={clsx(classes.appBar, {
                            [classes.appBarShift]: drawerOpen,
                        })}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={() => handleDrawerChange(true)}
                                edge="start"
                                className={clsx(classes.menuButton, drawerOpen && classes.hide)}
                            >
                                <MenuIcon />
                            </IconButton>

                            {activeUsecase ? <Avatar alt="Icon" src={UsecaseContent[activeUsecase].vignette.logo} /> : ''}

                            <Typography variant="h6" noWrap className={`${classes.title} ${classes.ml12}`}>

                                {activeUsecase ? UsecaseContent[activeUsecase].vignette.name : ''}
                            </Typography>
                            <UserMenu switchLookerUser={switchLookerUser} lookerUser={lookerUser} onLogoutSuccess={applySession} />
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={classes.drawer}
                        variant="persistent"
                        anchor="left"
                        open={drawerOpen}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <div className={classes.drawerHeader}>
                            <IconButton onClick={() => handleDrawerChange(false)}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        <Tabs
                            id="drawerTabs"
                            orientation="vertical"
                            variant="scrollable"
                            value={drawerTabValue}
                            onChange={handleDrawerTabChange}
                            aria-label="Vertical tabs example"
                            className={classes.tabs}
                        >
                            {activeUsecase ? UsecaseContent[activeUsecase].demoComponents.map((item, index) => (
                                <Tab label={item.label}
                                    key={`homeVerticalTabs${index}`}
                                    icon={<Icon className={`fa ${item.icon} ${classes.icon}`} />}
                                    {...a11yProps(index)}
                                    contenttype={validIdHelper(item.type)}
                                ></Tab>
                            ))
                                : ''
                            }
                        </Tabs>
                    </Drawer>
                    <main
                        className={clsx(classes.content, {
                            [classes.contentShift]: drawerOpen,
                        })}
                    >
                        <div className={classes.drawerHeader} />
                        {activeUsecase ?
                            UsecaseContent[activeUsecase].demoComponents.map((item, index) => {
                                const DemoComponent = demoComponentMap[item.type];
                                return (
                                    <TabPanel
                                        key={validIdHelper(`tab-panel-${item.type}`)}
                                        value={drawerTabValue}
                                        index={index}
                                        className={classes.relative}
                                    >
                                        {DemoComponent ?
                                            <DemoComponent key={validIdHelper(`list-${item.type}`)}
                                                staticContent={item}
                                                handleDrawerTabChange={handleDrawerTabChange}
                                                apiContent={this.state[_.camelCase(item.type) + 'ApiContent'] || []}
                                                action={typeof this[_.camelCase(item.type) + 'Action'] === 'function' ? this[_.camelCase(item.type) + 'Action'] : ''}
                                                activeTabValue={activeTabValue}
                                                handleTabChange={handleTabChange}
                                                lookerUser={lookerUser}
                                                sampleCode={sampleCode}
                                                activeUsecase={activeUsecase}
                                            /> :
                                            item.label
                                        }
                                    </TabPanel>)
                            }) : ''
                        }
                    </main >
                </ThemeProvider>
            </div >
        )
    }
}
export default withStyles(styles)(Home);