import React from 'react'
import BrandIcon, { type BrandIconProps } from './BrandIcon'
import { withBase } from '../../utils/basePath'

/**
 * AirTrail's own mark, unmodified: the control tower in its blue.
 *
 * The file is `static/favicon.svg` from johanohly/AirTrail, served from
 * `public/brands/`. Rendered as a file rather than as lucide's `TowerControl`
 * recoloured: the two happen to be the same shape today, and the day AirTrail
 * changes its logo TREK should follow the logo, not the coincidence.
 */
export default function AirTrailIcon(props: BrandIconProps): React.ReactElement {
  return <BrandIcon src={withBase('/brands/airtrail.svg')} {...props} />
}
