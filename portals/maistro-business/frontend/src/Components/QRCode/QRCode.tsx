// import React, { SVGProps, useRef } from 'react';
// import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
// import { Button, Flex } from '@radix-ui/themes';

// interface QRCodeProps {
//     url: string
//     logo: string
//     color?: string // TODO
// }

// const QRCode: React.FC<QRCodeProps> = (props) => {
//     const url = new URL(`https://${props.url}`)
//     const ref: React.LegacyRef<HTMLDivElement> | null = useRef(null)

//     const handleDownload = () => {
//         if (!ref.current) {
//             return
//         }

//         const svg = ref?.current?.querySelector('svg');
//         const svgData = new XMLSerializer().serializeToString(svg);
//         const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
//         const url = URL.createObjectURL(blob);

//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'qrcode.svg';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);
//     };

//     return (
//         <Flex direction="column" justify="center" align="center" gap="2">
//             <div ref={ref}>
//                 <QRCodeSVG
//                     value={url.toString()}
//                     size={400}
//                     bgColor={"#ffffff"}
//                     fgColor={"#e32b2b"}
//                     level={"M"}
//                     includeMargin={false}
//                     imageSettings={{
//                         src: props.logo,
//                         x: undefined,
//                         y: undefined,
//                         height: 100,
//                         width: 100,
//                         excavate: true,
//                     }}
//                 />
//             </div>

//             <Button variant="outline" m="2" onClick={handleDownload}>
//                 Download
//             </Button>
//         </Flex>
//     )
// }

// export default QRCode
