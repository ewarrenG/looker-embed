import FlagIcon from '@material-ui/icons/Flag';
import { Dashboard } from '@pbl-demo/components';
import { ModalButton, Dropdown, HiddenFilterValueText, NotesList, LinkText } from '@pbl-demo/components/Filters';
import { addCaseNotes, changeCaseStatus } from '@pbl-demo/components/Dashboard/helpers'
import { CloudFunctionHighlight, ApiHighlight } from '@pbl-demo/components/Accessories';

const addCaseNotesModal = {
  "copy": {
    "title": "Add Note",
    "suggestion": "Record a flag",
    "button": "Submit"
  },
  "method": addCaseNotes,
  "methodName": "addCaseNotes",
}

const addCaseNotesButton = {
  "label": "New Note",
  "component": ModalButton,
  "secondaryComponent": addCaseNotesModal,
  "tooltip": "Select a case",
  "gridWidth": 12,
  "highlightComponent": CloudFunctionHighlight
}


const changeCaseStatusSelect = {
  "label": "Case status",
  "component": Dropdown,
  "options": [
    { label: "Closed", value: "closed" },
    { label: "Open", value: "pending" },
  ],
  "method": changeCaseStatus,
  "methodName": "changeCaseStatus",
  "secondaryComponent": {
    "component": "button",
    "label": "Submit"
  },
  "tooltip": "Select a status",
  "gridWidth": 12,
  "highlightComponent": CloudFunctionHighlight
}

const caseId = {
  "label": "ID",
  "gridWidth": 3,
  "component": HiddenFilterValueText,
  "appendHiddenFilterToLabel": true,
  "highlightComponent": ApiHighlight,
  "requiresSelectionLabel": "Click a case ID to see more details and notes for this case",
}

const viewApplicationLink = {
  "label": "View Application",
  "gridWidth": 9,
  "component": LinkText,
  "appendHiddenFilterToLabel": true,
  "highlightComponent": ApiHighlight,
  "requiresSelectionLabel": "Click a case ID to see more details and notes for this case",
}

const caseNotesById = {
  "label": "Case Notes",
  "inlineQuery": {
    "model": "vision",
    "view": "application",
    "fields": [
      "case_events.datetime_date",
      "case_events.notes"
    ],
    "filters": {
      "case.case_id": "71"
    },
    "sorts": [
      "case_events.datetime_date"
    ],
    "limit": "500"
  },
  "resultFormat": "json",
  "highlightComponent": ApiHighlight,
  "apiKey": "noteslist",
  "component": NotesList,
  "gridWidth": 12,
}

export const FlagsConent = {
  "type": "dashboard",
  "label": "Flags",
  "menuCategory": "Home",
  "description": "Overview of all your web traffic",
  "icon": FlagIcon,
  "component": Dashboard,
  "lookerContent": [
    {
      "type": "dashboard",
      "lookerMethod": "embedDashboard",
      "id": "20",
      "slug": "219Tk9NQ4sGSjGNsRSFKjG",
      "label": "Flags",
      "isNext": false,
      "theme": "vision_theme",
      "adjacentContainer": {
        "gridWidth": 3,
        "collapsable": true,
        "items": [caseId, viewApplicationLink, changeCaseStatusSelect, caseNotesById, addCaseNotesButton],
        "label": "Case Details",
        "requiresSelection": true,
        "requiresSelectionMessage": "Click a case ID to see more details and notes for this case",
        "displayHiddenFilterValue": true
      }
    }],
  "requiredPermissionLevel": 1
}