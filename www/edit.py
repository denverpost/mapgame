#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Remove a block of text and put another block of text in its place.
# The replacement text can be a string or the contents of a file.
import os
import sys
import doctest
import csv
import argparse
import string
import re
import types
import codecs

class Replace:
    """ Extended search and replace functionality tuned toward maintaining
        a bunch of flat files easily with the aid of marked blocks in the 
        flat files and include files to insert into them.
        """

    def __init__(self, filename, args):
        """ Set the variables.
            """
        if args.verbose:
            print filename,
        self.append = args.append
        self.verbose = args.verbose
        self.filename = filename
        self.content = self.read_file(filename)
        self.search = args.search
        self.changes_made = False
        if os.path.isfile(args.replace):
            self.replace_content = self.read_file(args.replace)
        else:
            self.replace_content = args.replace

        content, changes_made = self.replace_it()
        if changes_made == 0 and self.append:
            # If we don't find what we're searching for, try this.
            print "APPEND: ", self.append
            content, changes_made = self.replace_it(self.append, 1)

        if content != '':
            self.write_file(content)

    def replace_it(self, search=None, append=0):
        """
            """
        if not search:
            search = self.search

        replace = self.replace_content
        if append != 0:
            replace += search

        content, changes_made = re.subn(search, replace, self.content,
                                        flags=re.MULTILINE|re.VERBOSE|re.IGNORECASE|re.DOTALL)
        self.changes_made = changes_made
        if self.verbose:
            print changes_made
        return content, changes_made

    def read_file(self, filename):
        """ Read a file, return its contents.
            """
        if filename == '':
            fn = codecs.open(self.filename, encoding='utf-8', mode='r')
        else:
            fn = codecs.open(filename, encoding='utf-8', mode='r')
        content = fn.read()
        fn.close
        return content

    def write_file(self, content):
        """ Write content to self.filename. Return True if nothing goes wrong.
            """
        fn = codecs.open(self.filename, encoding='utf-8', mode='w')
        fn.write(content)
        fn.close
        return True

def main(args):
    """ The main method.
        >>> args = build_parser(['--verbose', '--search=heyheyhey', '--replace=boo', 'games/test.html'])
        >>> a = build_parser(args)
        >>> main(a)
        """
    for item in args.files[0]:
        obj = Replace(item, args)

def build_parser(args):
    """ A method to handle argparse. We do it this way so arguments are testable.
        """
    parser = argparse.ArgumentParser(usage='$ python edit.py',
                                     description='''Edits a file, replacing a
                                                    regex with the contents of a file.''',
                                     epilog='')
    parser.add_argument("files", action="append", nargs="*")
    parser.add_argument("-r", "--replace", dest="replace", default='',
                        help="A string or a filepath to replace the regex pattern.")
    parser.add_argument("-a", "--append", dest="append", default='',
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
