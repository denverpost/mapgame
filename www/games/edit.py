#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Remove a block of text and put another block of text in its place.
# Blocks of text, as of now, are demarcated as such:
# <!-- START #MAPGAME# -->
# text etc. do what you want the rhythm's gonna get you
# <!-- END #MAPGAME# -->
#
#sed -i "/<!-- START #$BLOCKNAME# -->/,/<!-- END #$BLOCKNAME# -->/d" 
# The text that's inserted comes from a file.
# The operation's performed on all unnamed arguments.
import os
import sys
import doctest
import csv
import argparse

class Replace:
    """ Extended search and replace functionality tuned toward maintaining
        a bunch of flat files easily with the aid of marked blocks in the 
        flat files and include files to insert into them.
        """

    def __init__(self, filename, search, replace):
        """ Set the variables.
            """
        pass

    def is_file(self, path):
        """ Figure out if a string is a path to a file or just a string.
            """
        pass

    def replace(self):
        """ Look for the search pattern, then replace it with whatever.
            """

def main(args):
    """ 
        """
    for item in args.files[0]:
        obj = Replace(item, args.search, args.replace)

def build_parser(args):
    """ A method to handle argparse. We do it this way so it's testable.
        """
    parser = argparse.ArgumentParser(usage='$ python edit.py',
                                     description='''Edits a file, replacing a
                                                    regex with the contents of a file.''',
                                     epilog='')
    parser.add_argument("files", action="append", nargs="*")
    parser.add_argument("-r", "--replace", dest="replace", default='',
                        help="A string or a filepath to replace the regex pattern.")
    parser.add_argument("-s", "--search", dest="search", default='',
                        help="A regex to search for in the file.")
    parser.add_argument("-v", "--verbose", dest="verbose",
                        default=False, action="store_true")
    return parser.parse_args()

if __name__ == '__main__':
    args = build_parser(sys.argv)

    if args.verbose:
        doctest.testmod(verbose=args.verbose)

    main(args)
