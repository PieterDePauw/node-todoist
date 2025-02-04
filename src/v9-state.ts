/**===================================**
   *   	STATE MANAGER
/*====================================**/

import { deepcopy } from './utils/deepcopy'
import { State, StateFunctions } from './v9-interfaces'
import { resetSyncToken } from './v9-syncToken'

// Define the initial state
const initialState: State = {
  collaborator_states: [],
  collaborators: [],
  day_orders: {},
  day_orders_timestamp: '',
  filters: [],
  items: [],
  labels: [],
  live_notifications: [],
  live_notifications_last_read_id: -1,
  locations: [],
  notes: [],
  project_notes: [],
  projects: [],
  reminders: [],
  sections: [],
  user: {
    id: '0',
    auto_reminder: 0,
    avatar_big: '',
    avatar_medium: '',
    avatar_s640: '',
    avatar_small: '',
    business_account_id: '',
    daily_goal: 0,
    date_format: false,
    dateist_inline_disabled: false,
    dateist_lang: null,
    days_off: [],
    email: '',
    features: {},
    full_name: '',
    image_id: '',
    inbox_project_id: '',
    is_biz_admin: false,
    is_premium: false,
    joined_at: '2000-01-01',
    karma: 0,
    karma_trend: '',
    lang: 'en',
    next_week: 1,
    premium_until: '2000-01-01',
    sort_order: false,
    start_day: 1,
    start_page: 'inbox',
    team_inbox: 0,
    theme_id: 1,
    time_format: false,
    token: '',
    tz_info: {
      timezone: '',
      gmt_difference_hours: 0,
      gmt_difference_minutes: 0,
      is_dst: false,
      gmt_string: '00:00',
    },
    weekly_goal: 0,
    has_password: false,
    weekend_start_day: 1,
  },
  user_settings: {
    reminder_push: true,
    reminder_sms: false,
    reminder_desktop: true,
    reminder_email: true,
  },
  due_exceptions: [],
  incomplete_item_ids: [],
  incomplete_project_ids: [],
  settings_notifications: [],
  stats: [],
  tooltips: [],
}

// Create a state manager for the state and the local state
const createStateManager = (initState: State): StateFunctions => {
  let state = deepcopy(initState)
  let localState = deepcopy(initState)
  return {
    getState: (): State => {
      return deepcopy(state)
    },
    getLocalState: (): State => {
      return deepcopy(localState)
    },
    setState: (newState: State): State => {
      state = deepcopy(newState)
      return deepcopy(state)
    },
    setLocalState: (newLocalState: State): State => {
      localState = deepcopy(newLocalState)
      return deepcopy(localState)
    },
    resetState: (): State => {
      // Reset the sync token
      resetSyncToken()
      state = deepcopy(initState)
      localState = deepcopy(initState)
      return deepcopy(initState)
    },
  }
}

// Initialize a state manager for the state and the local state with the initial state
const { getState, getLocalState, setState, setLocalState, resetState } = createStateManager(initialState)

export { getState, getLocalState, setState, setLocalState, resetState }
