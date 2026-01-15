/**
 * CameraFrame Component
 * Overlay frame for camera scanning interface
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

interface CameraFrameProps {
  width?: number;
  height?: number;
}

export const CameraFrame: React.FC<CameraFrameProps> = ({ 
  width = 280, 
  height = 200 
}) => {
  const cornerSize = 30;
  const cornerWidth = 4;
  
  return (
    <View style={[styles.container, { width, height }]}>
      {/* Top-left corner */}
      <View style={[styles.corner, styles.topLeft, { width: cornerSize, height: cornerSize }]}>
        <View style={[styles.cornerLine, styles.topLeftHorizontal]} />
        <View style={[styles.cornerLine, styles.topLeftVertical]} />
      </View>
      
      {/* Top-right corner */}
      <View style={[styles.corner, styles.topRight, { width: cornerSize, height: cornerSize }]}>
        <View style={[styles.cornerLine, styles.topRightHorizontal]} />
        <View style={[styles.cornerLine, styles.topRightVertical]} />
      </View>
      
      {/* Bottom-left corner */}
      <View style={[styles.corner, styles.bottomLeft, { width: cornerSize, height: cornerSize }]}>
        <View style={[styles.cornerLine, styles.bottomLeftHorizontal]} />
        <View style={[styles.cornerLine, styles.bottomLeftVertical]} />
      </View>
      
      {/* Bottom-right corner */}
      <View style={[styles.corner, styles.bottomRight, { width: cornerSize, height: cornerSize }]}>
        <View style={[styles.cornerLine, styles.bottomRightHorizontal]} />
        <View style={[styles.cornerLine, styles.bottomRightVertical]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  cornerLine: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  topLeftHorizontal: {
    top: 0,
    left: 0,
    width: 30,
    height: 4,
  },
  topLeftVertical: {
    top: 0,
    left: 0,
    width: 4,
    height: 30,
  },
  topRightHorizontal: {
    top: 0,
    right: 0,
    width: 30,
    height: 4,
  },
  topRightVertical: {
    top: 0,
    right: 0,
    width: 4,
    height: 30,
  },
  bottomLeftHorizontal: {
    bottom: 0,
    left: 0,
    width: 30,
    height: 4,
  },
  bottomLeftVertical: {
    bottom: 0,
    left: 0,
    width: 4,
    height: 30,
  },
  bottomRightHorizontal: {
    bottom: 0,
    right: 0,
    width: 30,
    height: 4,
  },
  bottomRightVertical: {
    bottom: 0,
    right: 0,
    width: 4,
    height: 30,
  },
});
