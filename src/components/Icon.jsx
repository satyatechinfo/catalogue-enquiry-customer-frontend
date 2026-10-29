const PATHS = {
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  search: (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12l5 5L20 7" />,
  alert: (<><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5v.5" /></>),
  filter: <path d="M4 5h16l-6 8v6l-4-2v-4z" />,
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 7 9-7" /></>),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  chat: (<><path d="M4 20l1.3-4.2A8 8 0 1 1 8.2 18.8L4 20z" /><path d="M9 11h.01M12 11h.01M15 11h.01" /></>),
  gift: (<><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12" /><path d="M12 8c-3 0-4.500-4-2-4.500S12 8 12 8zM12 8c3 0 4.500-4 2-4.500S12 8 12 8z" /></>),
  lamp: (<><path d="M3 13h18c0 4-4 7-9 7s-9-3-9-7z" /><path d="M12 3c2.500 2.500 2.500 5 0 7-2.500-2-2.500-4.500 0-7z" /></>),
  sparkle: (<><path d="M10 3l1.800 5.200L17 10l-5.200 1.800L10 17l-1.800-5.200L3 10l5.200-1.800z" /><path d="M18 15l.8 2.200L21 18l-2.200.8L18 21l-.8-2.200L15 18l2.200-.8z" /></>),
  userPlus: (<><circle cx="9" cy="8" r="4" /><path d="M2 21c0-4 3-6 7-6s7 2 7 6" /><path d="M19 8v6M16 11h6" /></>),
  award: (<><circle cx="12" cy="9" r="6" /><path d="M8.500 14L7 22l5-3 5 3-1.500-8" /></>),
  heart: <path d="M12 20s-8-5-8-11a4.500 4.500 0 0 1 8-2.500A4.500 4.500 0 0 1 20 9c0 6-8 11-8 11z" />,
  mic: (<><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>),
  engrave: (<><path d="M4 20l1-4L16 5l3 3L8 19z" /><path d="M14 7l3 3M4 20h6" /></>),
  layers: <path d="M12 3l9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" />,
  thread: (<><path d="M4 20c4-6 6-2 8-8s5-6 8-8" /><circle cx="20" cy="4" r="1.500" /></>),
  box: <path d="M3 8l9-5 9 5v9l-9 5-9-5zM3 8l9 5 9-5M12 13v9" />,
  truck: (<><path d="M2 6h12v10H2zM14 10h4l4 3v3h-8z" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>),
  clipboard: <path d="M9 4h6v3H9zM6 5h12v16H6zM9 12h6M9 16h4" />,
  eye: (<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>),
  leaf: <path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19c3-5 6-8 10-10" />,
  share: (<><circle cx="6" cy="12" r="2.500" /><circle cx="18" cy="6" r="2.500" /><circle cx="18" cy="18" r="2.500" /><path d="M8.200 11l7.600-4M8.200 13l7.600 4" /></>),
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
};

export default function Icon({ name, size = 20, className = '', title }) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {PATHS[name] || PATHS.leaf}
    </svg>
  );
}
