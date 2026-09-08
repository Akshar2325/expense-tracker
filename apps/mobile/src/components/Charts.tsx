import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  G,
  Line,
  Path,
  Rect,
  Text as SvgText,
} from "react-native-svg";
import { useTheme, fontSize, fontFamily, radius } from "@/theme";
import { formatCurrency } from "@/lib/utils";

export interface TrendPoint {
  period: string;
  expense: number;
  income: number;
}

export interface CategorySlice {
  name: string;
  color: string;
  total: number;
}

/** Simple responsive bar chart (expense vs income per period). */
export function BarChart({
  data,
  height = 180,
}: {
  data: TrendPoint[];
  height?: number;
}) {
  const { palette } = useTheme();
  const width = 320;
  const pad = 8;
  const chartH = height - 24;
  const max = Math.max(1, ...data.flatMap((d) => [d.expense, d.income]));
  const slot = data.length ? width / data.length : width;
  const barW = Math.min(18, slot * 0.3);

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <Line
            key={f}
            x1={0}
            x2={width}
            y1={chartH - chartH * f}
            y2={chartH - chartH * f}
            stroke={palette.hairline}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}
        {data.map((d, i) => {
          const cx = slot * i + slot / 2;
          const expH = (d.expense / max) * chartH;
          const incH = (d.income / max) * chartH;
          return (
            <G key={d.period}>
              <Rect
                x={cx - barW - 2}
                y={chartH - expH}
                width={barW}
                height={expH}
                rx={6}
                fill={palette.ink}
              />
              <Rect
                x={cx + 2}
                y={chartH - incH}
                width={barW}
                height={incH}
                rx={6}
                fill="#a7e5d3"
              />
              <SvgText
                x={cx}
                y={height - 4}
                textAnchor="middle"
                fill={palette.muted}
                fontSize={9}
              >
                {d.period}
              </SvgText>
            </G>
          );
        })}
      </Svg>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: palette.ink }]} />
          <Text style={[styles.legendText, { color: palette.muted }]}>
            Expense
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#a7e5d3" }]} />
          <Text style={[styles.legendText, { color: palette.muted }]}>
            Income
          </Text>
        </View>
      </View>
    </View>
  );
}

/** Donut chart for category breakdown. */
export function DonutChart({
  data,
  size = 180,
}: {
  data: CategorySlice[];
  size?: number;
}) {
  const { palette } = useTheme();
  const total = data.reduce((sum, d) => sum + d.total, 0);
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  if (total === 0) {
    return (
      <View style={[styles.empty, { height: size }]}>
        <Text style={[styles.emptyText, { color: palette.muted }]}>
          No spending data yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.donutWrap}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={palette.hairlineSoft}
            strokeWidth={stroke}
            fill="none"
          />
          {data.map((d) => {
            const frac = d.total / total;
            const len = frac * c;
            const dash = `${len} ${c - len}`;
            const el = (
              <Circle
                key={d.name}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={d.color}
                strokeWidth={stroke}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                fill="none"
                strokeLinecap="round"
              />
            );
            offset += len;
            return el;
          })}
        </G>
      </Svg>
      <View style={styles.donutCenter}>
        <Text style={[styles.donutTotal, { color: palette.ink }]}>
          {formatCurrency(total)}
        </Text>
        <Text style={[styles.donutLabel, { color: palette.muted }]}>Total</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.body,
  },
  donutWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  donutCenter: {
    position: "absolute",
    alignItems: "center",
  },
  donutTotal: {
    fontSize: fontSize.titleMd,
    fontFamily: fontFamily.bodyBold,
  },
  donutLabel: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.body,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: fontSize.bodySm,
    fontFamily: fontFamily.body,
  },
});
