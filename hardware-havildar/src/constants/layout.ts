export interface Zone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export const STORE_WIDTH = 360;
export const STORE_HEIGHT = 640;

export const ZONES: Record<string, Zone> = {
  entrance: {
    id: 'entrance',
    x: 130,
    y: 580,
    width: 100,
    height: 60,
    label: 'Entrance',
  },
  billing: {
    id: 'billing',
    x: 80,
    y: 380,
    width: 200,
    height: 60,
    label: 'Billing Counter',
  },
  godown: {
    id: 'godown',
    x: 0,
    y: 480,
    width: 360,
    height: 90,
    label: 'Godown',
  },
  shelf_nails: {
    id: 'shelf_nails',
    x: 20,
    y: 200,
    width: 130,
    height: 80,
    label: 'Nails Shelf',
  },
  shelf_wire: {
    id: 'shelf_wire',
    x: 200,
    y: 200,
    width: 130,
    height: 80,
    label: 'Wire Shelf',
  },
  shelf_pipes: {
    id: 'shelf_pipes',
    x: 20,
    y: 80,
    width: 130,
    height: 80,
    label: 'Pipes Shelf',
  },
  shelf_paint: {
    id: 'shelf_paint',
    x: 200,
    y: 80,
    width: 130,
    height: 80,
    label: 'Paint Shelf',
  },
  shelf_nuts: {
    id: 'shelf_nuts',
    x: 20,
    y: 290,
    width: 130,
    height: 70,
    label: 'Nuts & Bolts',
  },
  shelf_cement: {
    id: 'shelf_cement',
    x: 200,
    y: 290,
    width: 130,
    height: 70,
    label: 'Cement',
  },
};
