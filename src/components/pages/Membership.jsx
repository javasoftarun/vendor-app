import React, { useState } from 'react';
import BottomNav from '../common/BottomNav';

const plans = [
  {
    label: "$49.95 PER WEEK",
    desc: "$5.00 for every 2 Metroplex Point of MEMBERSHIP Destinations per day"
  },
  {
    label: "$79.95 PER WEEK",
    desc: "4 free Metroplex Point of Destinations per day & $5.00 for every 2 additional Metroplex Point of Destinations."
  },
  {
    label: "$89.95 PER WEEK",
    desc: "6 free Metroplex Point of Destinations per day & $5.00 for every 2 additional Metroplex Point of Destinations."
  },
  {
    label: "$195.95 PER MONTH",
    desc: "$5.00 for every 3 Metroplex Point of Destinations per day"
  },
  {
    label: "$320.00 PER MONTH",
    desc: "5 free Metroplex Point of Destinations per day & $5.00 for every additional Metroplex Point of Destinations."
  },
  {
    label: "$360.00 PER MONTH",
    desc: "7 free Metroplex Point of Destinations per day & $5.00 for every additional Metroplex Point of Destinations."
  }
];

export default function Membership() {
  const [selected, setSelected] = useState(0);

  return (
    <div style={{ background: '#f7f7f7', minHeight: '100vh', fontFamily: 'inherit' }}>
      <div style={{
        maxWidth: 430,
        margin: '0 auto',
        paddingBottom: 40
      }}>
        {/* Header */}
        <div style={{
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          padding: '32px 0 18px 0',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 700,
          fontSize: 22,
          color: '#232b35',
          letterSpacing: 1,
          marginBottom: 18,
          justifyContent: 'center'
        }}>
          MEMBERSHIP
        </div>

        {/* Plans */}
        <div>
          {plans.map((plan, idx) => (
            <div
              key={idx}
              style={{
                background: selected === idx ? '#eaf6ff' : '#fff',
                borderRadius: 16,
                border: selected === idx ? '2px solid #7ecbff' : '1.5px solid #eee',
                boxShadow: selected === idx ? '0 2px 12px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
                padding: '18px 18px 12px 18px',
                marginBottom: 18,
                display: 'flex',
                alignItems: 'flex-start',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => setSelected(idx)}
            >
              <input
                type="radio"
                checked={selected === idx}
                onChange={() => setSelected(idx)}
                style={{
                  accentColor: '#3bb4f2',
                  width: 22,
                  height: 22,
                  marginRight: 16,
                  marginTop: 3
                }}
              />
              <div>
                <div style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#232b35',
                  marginBottom: 4
                }}>{plan.label}</div>
                <div style={{
                  color: '#555',
                  fontSize: 14,
                  lineHeight: 1.5
                }}>{plan.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pay Now Button */}
        <button
          style={{
            width: '100%',
            background: '#FFD600',
            border: 'none',
            borderRadius: 24,
            padding: '16px 0',
            fontWeight: 700,
            fontSize: 18,
            color: '#232b35',
            marginTop: 18,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}
        >
          PAY NOW
        </button>
      </div>
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}