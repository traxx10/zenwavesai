import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg'
export const WalletIcon = (props) => {
 return (
  <Svg
   xmlns="http://www.w3.org/2000/svg"
   xmlnsXlink="http://www.w3.org/1999/xlink"
   width={18}
   height={18}
   fill="none"
   {...props}
  >
   <Path fill="url(#a)" d="M0 0h18v18H0z" />
   <Defs>
    <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
     <Use xlinkHref="#b" transform="scale(.01)" />
    </Pattern>
    <Image
     xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACq0lEQVR4nO3dPWsUQQDG8Y2ojZ2IWMYXRBAUsRBTRAtrsUmjp6hoK6iQIFgEscgH8AsYrGxEm2AfA4HTSkSwUkEQEQRfCt/+sjghKS63c7A38+Tm+cGW2czOP3u3e5vdqyozMzMzMzMzM7OCAZuB48A54DowU8hyoFICHAbuA58p01SlANgRQvyhbFMKMfYDr3PPhIi8QYCDwJfcsyAkXxBgO/Am9wyIyRpkPvfWC8oTBDjkN3CtIPURVax3QLeQ5VSuk76Y84xHwJ7kAywNMBEZYyz3WIsAnG2I8RfYm3ucxQBuNgR5m3uMRQFmHWRjBan5JUssyGNgU7JBlSwyyEqUfbnHO/IGCLLivcAJW3dIyzLwBJgGdm+UIKX4CdwDtjmIlhfATu8hWhaBrX7J0nLNQbR8SHLo7zf1gUwoBPkGfBxs3CPrqkKQl/VH78ARoAPcAOZGdPnUMBe3JYJUheD/H18/sykG4SCBg4hxEDEOIsZBxDiIGAcR4yBiHESMg4hxEDEOIsZBxDiIGAcR4yBDABwDHoR/fHsKXIq9Fu4gLQPOA797XFh6GBPFQVoE7AK+97nadzFiHb5i2BbgSsPl14WIdThIW4BbDUGeR6zDQdoCnGkIMh+xDgdpC7AFeLVOjF/A0Yh1OEib6huKekT5Wt9pHPnzDjKkPeV0uOnm8iC3EjiIGAcR4yBiHESMg4hxEDEOIsZBxDiIGAcR4yBiHESMg4hxEDEOIsZBxKgEqb/ap58fAk966yZa6m3tZzpFkAsNg7BVnRRBxtf8QusvzXMYgaWGgRgsJokRgpwMz3i33uq5mUwWJES5u85gjARHVz2CjIUo3lNW1XNxJ+tXdQAngGdrBlXyk0gnKxXh6KsTzlPmCllmwjaP555/MzMzMzMzMzOzKrF/7c4Y8fhJnw4AAAAASUVORK5CYII="
     id="b"
     width={100}
     height={100}
    />
   </Defs>
  </Svg>
 )
}
