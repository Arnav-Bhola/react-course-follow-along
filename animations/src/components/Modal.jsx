import { createPortal } from "react-dom";
import { motion } from "framer-motion";

export default function Modal({ title, children, onClose }) {
  return createPortal(
    <>
      <div
        className='backdrop'
        onClick={onClose}
      />
      <motion.dialog
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        open
        className='modal'
        initial='hidden'
        animate='visible'
        exit='hidden'
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
      >
        <h2>{title}</h2>
        {children}
      </motion.dialog>
    </>,
    document.getElementById("modal")
  );
}

