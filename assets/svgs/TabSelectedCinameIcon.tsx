import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg'
export const TabSelectedCinemaIcon = (props) => {
 const { width, height } = props
 return (
  <Svg
   xmlns="http://www.w3.org/2000/svg"
   xmlnsXlink="http://www.w3.org/1999/xlink"
   width={width || 21}
   height={height || 21}
   fill="none"
   {...props}
  >
   <Path fill="url(#a)" d="M0 0h21v21H0z" />
   <Defs>
    <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
     <Use xlinkHref="#b" transform="scale(.01)" />
    </Pattern>
    <Image
     xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADLklEQVR4nO2dPYvUUBSGs4XWKvgH/EARxN17UswPEBQRP4rpFWVxFbSwmTknMLW6oqLif5ha7VS02C3Fj0JsbQQLtVZ4JTOyuKI7mcxN7p3kfeA0Uww357nJubn3JkkSQgghhBBCCCGEEEIIqZLOALtEcVEMD8UwZKBIDvJcXTjcw06vMkRx1Sm+iwEMlMnBN2e44kWGU9ymBPjqiDdnlXGWMuD1qpBmOFVeiOEdhcD3ZfpNKRmLGfZTBqqqmXunFiIZTlAIKhGyZDg+vRBDd4s/7Rb8j2EDR2bDuvJHIUYhoXs7eIaETygoJHwSQSEs6l0WdeMZwmHvf+Cw11hDJsIbQ9R2Y8iwmXJAIRJXJ6IQCS9hzoUonuVLx2JYEcXLCJLYYiGKW0mChU3tUZwWxccIktkuIc7w+dAA2//Vpvx36eO6KL5GkNSohKwV2QbkFJ9KCHk6qW2Lfex2hkfO8LP2DjM+piJbgNbqFFLlAtWwcBv7OOgUT2qW0roFquG0bU0NR53iPYVEIiRHlrHNKZZF8YVnSARCNm15Ndxzih+8ZEUgpIb6whoyCxXUFwqZFc/1hUJ84am+UIhv0gwHxPC4MUJ+P6LQLRDroYp6EVyGk07xYcr2rRc59gmPcczPXJbUKGRjfsxwp+ZjpJBJjKb7KSQqIZcohEKK05YaMgYLYnjOMySWoq64O9dFncNeRDfsjWo9pMzEY6NuDOdVSIdTJ3EIEU4uxiMk5fT7Hz2TC1RofQ3pcAl3i2s3NzmglWdIym1AcQgRbpTbSBq3klpcW0krC8fN1nEJkXGs8nGEuITAKV64DNec4rIYXoVsSwUxP5csaUdQiISXQCHSIiF8o1yL1kMQebRugQqRB4VIeAkUIuETTyESPtkUEkGCQSHhkwoKCZ9IUAiHvfB2H5K/MD6C3ogmhlMcm15ID/tCN1waGmkPe5IyiOJt6MZLw8IZXpeSMRKS4UzoA5CGRf6gaWkhIymG1dAHIQ0Jp7iR+CD/5Fv+6bfQByTzGuM34K0kPsk/jrhkOC+KB/yoJAp9WNMZ7jvFuSMD7PAqgxBCCCGEEEIIIYQQQpK/+AVxFU0cV4vzZwAAAABJRU5ErkJggg=="
     id="b"
     width={100}
     height={100}
    />
   </Defs>
  </Svg>
 )
}
