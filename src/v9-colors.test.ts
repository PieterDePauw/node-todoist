import { getColor } from './v9-colors';
import * as Types from './v9-types'

describe('getColor', () => {
	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'berry_red';
		const expectedColor = '#b8256f';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'red';
		const expectedColor = '#db4035';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'orange';
		const expectedColor = '#ff9933';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'yellow';
		const expectedColor = '#fad000';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'olive_green';
		const expectedColor = '#afb83b';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'lime_green';
		const expectedColor = '#7ecc49';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'green';
		const expectedColor = '#299438';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'mint_green';
		const expectedColor = '#6accbc';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'teal';
		const expectedColor = '#158fad';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'sky_blue';
		const expectedColor = '#14aaf5';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'light_blue';
		const expectedColor = '#96c3eb';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'blue';
		const expectedColor = '#4073ff';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'grape';
		const expectedColor = '#884dff';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'violet';
		const expectedColor = '#af38eb';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'lavender';
		const expectedColor = '#eb96eb';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'magenta';
		const expectedColor = '#e05194';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'salmon';
		const expectedColor = '#ff8d85';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'charcoal';
		const expectedColor = '#808080';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'grey';
		const expectedColor = '#b8b8b8';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns the correct color for a valid color id', () => {
		const colorId: Types.ColorId = 'taupe';
		const expectedColor = '#ccac93';
		const actualColor = getColor(colorId);
		expect(actualColor).toEqual(expectedColor);
	});

	it('returns undefined for an invalid color id', () => {
		const colorId = 'invalid';
		// @ts-ignore
		const actualColor = getColor(colorId);
		expect(actualColor).toBeUndefined();
	});
});