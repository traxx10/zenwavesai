import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg'
export const TabAccountSelectedIcon = (props) => {
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
     xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEkElEQVR4nO2dS4hcRRSGK+JCg/hWjOJ7IShx7Dp3QiSRbFQE0Y2iERSzEcSAGhSn+5zGKy58oAi6UBJ0pYjgYye6ECSiC5OoiAbFgPFBFiJqiEYTo/NL9bTSDt3iZO6959yp88EPwwwz0+d8VN3uvlXVITiO4ziO4ziO4ziO4xwWNIPjij6uJcHjxHiDBLtI8GNkHEpJXw++l37GeKzDuGZViWO93RVDPVwRBa9Exm8kwEKSficyXi4El7uYRRJ7uCwyti1UwkQ5gvephzUuZoGs3oSjSbCZBLNVyRjJbBQ8s67EUS7mf0AzOCsKPqpBxPyp7MNCcKZL+Q+KLs4jwe66ZYxI+XKV4FyXMobpLk4ixhdNyRiVckkPp7iUUUocERlvNy1jJG+lx+BS/r5u9HCPogwMR8rdLiSE0ClxOjH2awshwS/EWJG9FGJsMSADgzCezlpIupiS4IC6CPknBy4ucWrIFRJ0DUjAvNwXcqWJF4C08GwPOdIRnG2g+RiT2SnGGSE3Oj3cbKD5GJeih/UhN0jwpHbjaUIi44mQGyR407CQ10NuRMbn2o2nydkZciMyfjDQeIwN4/uQG4dzO5aamrIEv4bcGC5KsCmEcSjkhk9Zxkg3hrRHAk3OrpAbxNhheMraFnIjMl7UbjxNzvMhN6KADTQeY8OYCbmRlnkaFnJ1yHSVyZ/qzZd/Jwr+WF3ixJAjVS4TpaqEMN4LuUKCBw2OkPtDrhR9dLQF0Pz0sTLkjKnbuIwdIXeIcaeh6WpjyJ2VXZwQBfsMyNiXHot2P0wQGY9qCyHGw9p9MAOVOJkYPyvK2J/1ArlxRMEjiiPkIe36zUEllhPjq8avHYxvLyxxjHb9JukIbmx8dPRxvXbdpiHBaw1eO17Vrtc8UyWOb2KfYWR8k97g1K63FVAPa4hxsMaRcbDTxaXadbaKoof1Nb09P1sIbtGur5VExh01XMQ3adfVaqhiIdr1tB5yIbYgF2ILciG2IBdiC3IhtiAXYgtyIXYgxoqqhUyXOE27rtZCNezUzXKHbRVExoZa3sua+5u3atfXGtaVOHJwBkqN637T+t10pkn6X9r1GgbLOoKr0uGUdYkYkw9IcGX639rV2zqFtI+7IuPTBkXMHzGfpMeQ7SmlUzM4ZyBB8G5NZ/NiEdlJggeKPi4IS5npPi5KhVreW0hj5AyXJ61dAtMalg2PCn+KBF8baC4WlbklSulp+NrQJtL62PQMxvhZJlhkPouCe9OnNQTjItIGnL0GGoaGRs1PaRpOK2WCuQ2cjD3qDRI1Md8VjOtsfIoB4yX1hoiRMF5Q+9SF4YK2d9SbIMbC2Nr4tWWwMHruVa5+A8RktqfZozEhUfCcgaJhPJsbkUGCmwwUizYk9nBDrTLSMEz7KbQLpbYkPfMssbw2IWmXqnqR0rIwbq9NCAk+Vi9Q2pV0O6EuGedrF0ctTS2fc5WGnnZh1NJEwW2VC4mMZ7ULo7aGsaV6IXM3k/SLkxaGsbVyIUvinoaoZXflQiycR0Ltzd6sTqIm+/m9ciGO4ziO4ziO4ziO44T6+Qud7JetNOFAIAAAAABJRU5ErkJggg=="
     id="b"
     width={100}
     height={100}
    />
   </Defs>
  </Svg>
 )
}
