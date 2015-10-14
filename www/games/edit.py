#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Remove a block of text and put another block of text in its place.
# Blocks of text, as of now, are demarcated as such:
# <!-- START #MAPGAME# -->
# text etc. do what you want the rhythm's gonna get you
# <!-- END #MAPGAME# -->
#
# The text that's inserted comes from a file.
# The operation's performed on all unnamed arguments.

BLOCKNAME=''
FILE=''

while [ "$1" != "" ]; do
    case $1 in
        -b | --blockname )
            BLOCKNAME=$1
            shift;;
        -f | --file )
            file=$1
            shift;;
    esac
done

# Remove the existing block
#sed -i "/<!-- START #$BLOCKNAME# -->/,/<!-- END #$BLOCKNAME# -->/d" 
#    echo "###START-$BLOCKNAME" >> 
#    cat
#    echo '###END-blockit' >> 
