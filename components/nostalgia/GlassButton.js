"use client";
import { motion } from "framer-motion";

/**
 * Reusable glass pill/button component.
 *
 * @param {Object} props
 * @param {'a'|'button'} props.as
 * @param {React.ReactNode} props.icon
 * @param {string} props.label
 * @param {string} [props.className]
 * @param {'pill'|'icon'|'player'} [props.variant]
 */
export default function GlassButton({
  as: Tag = "button",
  icon,
  label,
  className = "",
  variant = "pill",
  ...rest
}) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{ display: "inline-flex" }}
    >
      <Tag
        className={`glass-pill ${variant === "icon" ? "glass-pill--icon" : ""} ${className}`}
        {...rest}
      >
        {icon && <span className="glass-pill__icon" aria-hidden="true">{icon}</span>}
        {label && <span className="glass-pill__label">{label}</span>}
      </Tag>
    </motion.div>
  );
}
