import * as Types from './v9-types'

// The object COLORS_BY_ID contains all color names as keys and the respective hexadecimal color codes as values (e.g. { 'berry_red': '#b8256f' })
export const COLORS_BY_ID: Record<Types.ColorId, string> = {
  'berry_red': '#b8256f',
  'red': '#db4035',
  'orange': '#ff9933',
  'yellow': '#fad000',
  'olive_green': '#afb83b',
  'lime_green': '#7ecc49',
  'green': '#299438',
  'mint_green': '#6accbc',
  'teal': '#158fad',
  'sky_blue': '#14aaf5',
  'light_blue': '#96c3eb',
  'blue': '#4073ff',
  'grape': '#884dff',
  'violet': '#af38eb',
  'lavender': '#eb96eb',
  'magenta': '#e05194',
  'salmon': '#ff8d85',
  'charcoal': '#808080',
  'grey': '#b8b8b8',
  'taupe': '#ccac93',
};

// Alias for COLORS_BY_ID
export const colorsById = COLORS_BY_ID

// The function getColor takes color ids as argument and returns corresponding hexadecimal color codes for that color (e.g. 'red' => '#db4035')
export const getColor = (id: Types.ColorId) => {
	COLORS_BY_ID[id]
}
