import{r as n,u as B,j as a,I as _,k as G,C as H}from"./index-CkOAiIbX.js";import{M as K,F as V,E as Q}from"./leaflet.draw-DMqb3_43.js";import{L as u,M as J,T as W,u as X}from"./TileLayer-D3K3lq-I.js";import"./index-JZDn1_XU.js";import"./index-BBQ7Xl2T.js";function Y({onMapReady:c}){const s=X();return n.useEffect(()=>{c(s)},[s,c]),null}typeof window<"u"&&(delete u.Icon.Default.prototype._getIconUrl,u.Icon.Default.mergeOptions({iconRetinaUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",iconUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"}));function ee(){const[c,s]=n.useState(!1);return n.useEffect(()=>{const p=document.documentElement,f=()=>s(p.classList.contains("dark"));f();const d=new MutationObserver(f);return d.observe(p,{attributes:!0,attributeFilter:["class"]}),()=>d.disconnect()},[]),c}function se({name:c,value:s,onChange:p,placeholder:f,hideActions:d=!1,className:Z,defaultCenter:v={lat:30.0444,lng:31.2357},defaultZoom:S=12}){const x=n.useRef(null),m=n.useRef(null),[I,L]=n.useState(!1),E=B(),[k,C]=n.useState(""),[y,j]=n.useState(!1),[w,N]=n.useState(""),[D,R]=n.useState(null),F=ee(),h=e=>p?.(e),T=n.useMemo(()=>{const e=Number(v?.lat),o=Number(v?.lng);return Number.isFinite(e)&&Number.isFinite(o)?{lat:e,lng:o}:{lat:30.0444,lng:31.2357}},[v]),M=()=>{m.current?.clearLayers()},$=e=>{const o=e.getLatLngs();return((Array.isArray(o)&&Array.isArray(o[0])?o[0]:o)||[]).map(t=>({lat:Number(t.lat.toFixed(6)),lng:Number(t.lng.toFixed(6))}))};n.useEffect(()=>{if(!I)return;const e=x.current,o=m.current;if(!e||!o)return;const l=setTimeout(()=>{try{if(M(),!s||s.length<3)return;const t=s.map(i=>[Number(i.lat),Number(i.lng)]).filter(([i,q])=>Number.isFinite(i)&&Number.isFinite(q));if(t.length<3)return;const b=u.polygon(t);o.addLayer(b);const g=b.getBounds();g.isValid()&&e.fitBounds(g,{padding:[20,20]})}catch(t){console.error("Error drawing polygon",t)}},100);return()=>clearTimeout(l)},[s,I]);const z=e=>{M(),m.current?.addLayer(e.layer),e.layerType==="polygon"&&e.layer instanceof u.Polygon?h($(e.layer)):h([])},U=e=>{let o=[];e.layers.eachLayer(l=>{l instanceof u.Polygon&&(o=$(l))}),h(o)},A=()=>h([]),O=async()=>{const e=k.trim();if(e){j(!0),N("");try{const o="https://nominatim.openstreetmap.org/search?"+new URLSearchParams({q:e,format:"json",limit:"1"}).toString(),l=await fetch(o,{headers:{Accept:"application/json"}});if(!l.ok)throw new Error("Search request failed");const t=await l.json();if(!t?.length){N("No results found.");return}const b=parseFloat(t[0].lat),g=parseFloat(t[0].lon),i={lat:b,lng:g};R(i),x.current?.setView(i,14)}catch{N("Search failed. Try again.")}finally{j(!1)}}},P=n.useMemo(()=>F?"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png":"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",[F]),r="map-zone-scope";return a.jsxDEV("div",{className:Z,children:[!d&&a.jsxDEV("div",{className:"flex gap-2 mb-2.5",children:[a.jsxDEV(_,{name:c,value:k,onChange:e=>C(e.target.value),onKeyDown:e=>{e.key==="Enter"&&O()},placeholder:f||"Search a place (e.g., Zamalek, Cairo)",className:"flex-1"},void 0,!1,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:241,columnNumber:11},this),a.jsxDEV(G,{onClick:()=>{O()},disabled:y,variant:"outline",children:E(y?"Searching":"Search")},void 0,!1,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:251,columnNumber:11},this)]},void 0,!0,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:240,columnNumber:9},this),w?a.jsxDEV("div",{className:"mb-2.5 text-destructive text-sm",children:w},void 0,!1,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:257,columnNumber:22},this):null,a.jsxDEV(H,{className:"p-0 overflow-hidden",children:a.jsxDEV("div",{className:`h-[420px] w-full ${r}`,children:[a.jsxDEV(J,{center:T,zoom:S,style:{height:"100%",width:"100%"},children:[a.jsxDEV(Y,{onMapReady:e=>{x.current=e,L(!0)}},void 0,!1,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:268,columnNumber:13},this),a.jsxDEV(W,{url:P},void 0,!1,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:275,columnNumber:13},this),D?a.jsxDEV(K,{position:D},void 0,!1,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:278,columnNumber:31},this):null,d?a.jsxDEV(V,{ref:m},void 0,!1,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:299,columnNumber:15},this):a.jsxDEV(V,{ref:m,children:a.jsxDEV(Q,{position:"topright",onCreated:z,onEdited:U,onDeleted:A,draw:{polygon:!0,rectangle:!1,circle:!1,circlemarker:!1,marker:!1,polyline:!1},edit:{edit:!0,remove:!0}},void 0,!1,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:282,columnNumber:17},this)},void 0,!1,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:281,columnNumber:15},this)]},void 0,!0,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:261,columnNumber:11},this),a.jsxDEV("style",{jsx:!0,global:!0,children:`
            .${r} .leaflet-container {
              background-color: hsl(var(--background));
              color: hsl(var(--foreground));
            }

            .${r} .leaflet-control,
            .${r} .leaflet-bar {
              background-color: hsl(var(--card));
              border: 1px solid hsl(var(--border));
              box-shadow: 0 1px 8px hsl(var(--foreground) / 0.08);
            }

            .${r} .leaflet-bar a,
            .${r} .leaflet-draw-toolbar a {
              background-color: hsl(var(--card)) !important;
              color: hsl(var(--foreground));
              border-bottom: 1px solid hsl(var(--border));
            }

            .${r} .leaflet-bar a:hover,
            .${r} .leaflet-draw-toolbar a:hover {
              background-color: hsl(var(--muted)) !important;
            }

            .${r} .leaflet-bar a:focus {
              outline: none;
              box-shadow: 0 0 0 2px hsl(var(--ring) / 0.35);
            }

            .${r} .leaflet-draw-tooltip {
              background-color: hsl(var(--popover));
              color: hsl(var(--popover-foreground));
              border: 1px solid hsl(var(--border));
              box-shadow: 0 8px 30px hsl(var(--foreground) / 0.12);
            }

            .${r} .leaflet-draw-actions a {
              background-color: hsl(var(--card));
              color: hsl(var(--foreground));
              border: 1px solid hsl(var(--border));
            }

            .${r} .leaflet-popup-content-wrapper,
            .${r} .leaflet-popup-tip {
              background-color: hsl(var(--popover));
              color: hsl(var(--popover-foreground));
              border: 1px solid hsl(var(--border));
            }

            .${r} .leaflet-control-attribution {
              background-color: hsl(var(--card) / 0.85);
              color: hsl(var(--muted-foreground));
              border: 1px solid hsl(var(--border));
            }

            /* Dark mode adjustments for draw toolbar icons */
            .dark .${r} .leaflet-draw-toolbar a {
              filter: invert(1);
            }

            /* Fix for missing leaflet-draw icons */
            .${r} .leaflet-draw-toolbar a {
              background-image: url('https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/images/spritesheet.png');
              background-repeat: no-repeat;
              background-size: 300px 30px;
            }

            .leaflet-retina .${r} .leaflet-draw-toolbar a {
              background-image: url('https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/images/spritesheet-2x.png');
            }

            /* Dark mode adjustments for marker icons */
            .dark .${r} .leaflet-marker-icon {
              filter: invert(1) brightness(1.5);
            }
          `},void 0,!1,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:304,columnNumber:11},this)]},void 0,!0,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:260,columnNumber:9},this)},void 0,!1,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:259,columnNumber:7},this)]},void 0,!0,{fileName:"/media/compumisr/hardOld1/neovidia/FrontEnd/dashboard-react/src/components/common/Inputs/map/MapZoneInputInner.tsx",lineNumber:238,columnNumber:5},this)}export{se as default};
//# sourceMappingURL=MapZoneInputInner-VXx33Mnf.js.map
