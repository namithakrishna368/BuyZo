import { useRef } from 'react';

const OtpInput = ({ value, onChange, length = 6 }) => {
  const inputs = useRef([]);

  const digits = value.padEnd(length, ' ').split('').slice(0, length);

  const handleChange = (index, char) => {
    if (char && !/^\d$/.test(char)) return;
    const next = digits.map((d, i) => (i === index ? char : d.trim())).join('').replace(/\s/g, '');
    onChange(next);
    if (char && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() || ''}
          onChange={(e) => handleChange(i, e.target.value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="h-12 w-10 rounded-lg border border-cream-300 bg-white text-center text-lg font-bold text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 sm:h-14 sm:w-12 sm:text-xl"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
};

export default OtpInput;
